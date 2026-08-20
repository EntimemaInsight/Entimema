"""Deterministic, dependency-light extractors for the initial intake formats."""

from __future__ import annotations

import csv
import io
import re
import zipfile
from abc import ABC, abstractmethod
from pathlib import PurePosixPath
from uuid import uuid4
from xml.etree import ElementTree as ET

from evidence.models import EvidenceCandidate, EvidenceLocation, EvidenceSource


class ExtractionError(ValueError):
    pass


class Extractor(ABC):
    name: str
    version = "1.0"

    @abstractmethod
    def extract(
        self, artifact_id: str, extraction_id: str, content: bytes
    ) -> list[EvidenceCandidate]: ...

    @staticmethod
    def candidate(artifact_id, extraction_id, proposition, location, **values):
        return EvidenceCandidate(
            id=str(uuid4()),
            case_id=values.pop("case_id", "pending"),
            proposition=proposition,
            source=EvidenceSource(
                artifact_id=artifact_id, extraction_id=extraction_id, location=location
            ),
            extraction_method=values.pop("extraction_method"),
            **values,
        )


class CSVExtractor(Extractor):
    name = "entimema.csv"

    def extract(self, artifact_id, extraction_id, content):
        try:
            text = content.decode("utf-8-sig")
            encoding = "utf-8-sig" if content.startswith(b"\xef\xbb\xbf") else "utf-8"
        except UnicodeDecodeError as exc:
            raise ExtractionError("CSV must be UTF-8 encoded") from exc
        sample = text[:4096]
        try:
            dialect = csv.Sniffer().sniff(sample, delimiters=",;\t|")
        except csv.Error:
            dialect = csv.excel
        reader = csv.DictReader(io.StringIO(text), dialect=dialect)
        if not reader.fieldnames:
            raise ExtractionError("CSV has no header row")
        candidates = []
        for row_number, row in enumerate(reader, start=2):
            for column in reader.fieldnames:
                raw = row.get(column)
                if raw is None or raw == "":
                    continue  # Missing is intentionally not converted to zero.
                candidates.append(
                    self.candidate(
                        artifact_id,
                        extraction_id,
                        f"{column} = {raw}",
                        EvidenceLocation(row=row_number, column=column),
                        concept=column,
                        value=raw,
                        raw_value=raw,
                        data_type="STRING",
                        extraction_method=f"{self.name}@{self.version};encoding={encoding};delimiter={dialect.delimiter}",
                    )
                )
        return candidates


class XLSXExtractor(Extractor):
    name = "entimema.xlsx"
    NS = {
        "m": "http://schemas.openxmlformats.org/spreadsheetml/2006/main",
        "r": "http://schemas.openxmlformats.org/officeDocument/2006/relationships",
    }
    REL_NS = {"p": "http://schemas.openxmlformats.org/package/2006/relationships"}

    def extract(self, artifact_id, extraction_id, content):
        try:
            archive = zipfile.ZipFile(io.BytesIO(content))
            if len(archive.infolist()) > 10_000:
                raise ExtractionError("XLSX contains too many archive entries")
            if sum(x.file_size for x in archive.infolist()) > 100_000_000:
                raise ExtractionError("XLSX expanded size exceeds safety limit")
            workbook = ET.fromstring(archive.read("xl/workbook.xml"))
            relations = ET.fromstring(archive.read("xl/_rels/workbook.xml.rels"))
        except (zipfile.BadZipFile, KeyError, ET.ParseError) as exc:
            raise ExtractionError("malformed XLSX container") from exc
        rels = {x.attrib["Id"]: x.attrib["Target"] for x in relations}
        shared = []
        if "xl/sharedStrings.xml" in archive.namelist():
            root = ET.fromstring(archive.read("xl/sharedStrings.xml"))
            shared = ["".join(x.text or "" for x in si.iterfind(".//m:t", self.NS)) for si in root]
        candidates = []
        for sheet in workbook.findall("m:sheets/m:sheet", self.NS):
            name = sheet.attrib["name"]
            target = rels[sheet.attrib[f"{{{self.NS['r']}}}id"]]
            target = str(PurePosixPath("xl") / target) if not target.startswith("/") else target[1:]
            target = str(PurePosixPath(target))
            root = ET.fromstring(archive.read(target))
            for cell in root.findall(".//m:c", self.NS):
                ref, kind = cell.attrib["r"], cell.attrib.get("t", "n")
                value_node, formula_node = cell.find("m:v", self.NS), cell.find("m:f", self.NS)
                raw = value_node.text if value_node is not None else None
                formula = f"={formula_node.text}" if formula_node is not None else None
                if raw is None and formula is None:
                    continue
                displayed = shared[int(raw)] if kind == "s" and raw is not None else raw
                value = displayed
                if kind == "n" and raw is not None:
                    try:
                        value = float(raw)
                    except ValueError:
                        pass
                candidates.append(
                    self.candidate(
                        artifact_id,
                        extraction_id,
                        f"{name}!{ref} = {displayed}",
                        EvidenceLocation(sheet=name, cell=ref),
                        value=value,
                        raw_value=raw,
                        displayed_value=displayed,
                        formula=formula,
                        value_kind="FORMULA_RESULT" if formula else "HARDCODED",
                        data_type=kind,
                        extraction_method=f"{self.name}@{self.version}",
                    )
                )
        return candidates


class PDFExtractor(Extractor):
    name = "entimema.pdf"

    def extract(self, artifact_id, extraction_id, content):
        if not content.startswith(b"%PDF-") or b"%%EOF" not in content[-2048:]:
            raise ExtractionError("malformed PDF")
        # Deterministic text-layer extraction. Scanned/image PDFs require a future OCR adapter.
        page_markers = [match.start() for match in re.finditer(rb"/Type\s*/Page(?!s)", content)]
        pages = max(1, len(page_markers))
        chunks = re.findall(rb"\(([^()]*)\)\s*Tj", content)
        decoded = [x.decode("latin-1", errors="replace") for x in chunks if x.strip()]
        if not decoded:
            return []
        per_page = max(1, (len(decoded) + pages - 1) // pages)
        return [
            self.candidate(
                artifact_id,
                extraction_id,
                text,
                EvidenceLocation(
                    page=min(index // per_page + 1, pages), region=f"text-{index + 1}"
                ),
                value=text,
                raw_value=text,
                data_type="TEXT",
                extraction_method=f"{self.name}@{self.version};text-layer",
            )
            for index, text in enumerate(decoded)
        ]


EXTRACTORS = {
    "application/pdf": PDFExtractor(),
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": XLSXExtractor(),
    "text/csv": CSVExtractor(),
}
