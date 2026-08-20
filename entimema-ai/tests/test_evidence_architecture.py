import io
import zipfile

import pytest

from evidence.extractors import CSVExtractor, PDFExtractor, XLSXExtractor
from evidence.models import AdmissionStatus
from evidence.repository import EvidenceRepository
from evidence.service import EvidenceAccessError, EvidenceService
from evidence.store import LocalArtifactStore
from live.response import empty_projection
from live.session import RuntimeMode, SQLiteSessionStore


def xlsx_bytes() -> bytes:
    output = io.BytesIO()
    with zipfile.ZipFile(output, "w") as archive:
        archive.writestr(
            "xl/workbook.xml",
            '<workbook xmlns="http://schemas.openxmlformats.org/'
            'spreadsheetml/2006/main" xmlns:r="http://schemas.openxmlformats.org/'
            'officeDocument/2006/relationships"><sheets><sheet name="P&amp;L" '
            'sheetId="1" r:id="rId1"/></sheets></workbook>',
        )
        archive.writestr(
            "xl/_rels/workbook.xml.rels",
            '<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/'
            'relationships"><Relationship Id="rId1" Target="worksheets/sheet1.xml"/>'
            "</Relationships>",
        )
        archive.writestr(
            "xl/worksheets/sheet1.xml",
            '<worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main">'
            '<sheetData><row r="27"><c r="F27"><f>SUM(F10:F26)</f><v>1250000</v>'
            '</c><c r="G27"><v>9</v></c></row></sheetData></worksheet>',
        )
    return output.getvalue()


def pdf_bytes() -> bytes:
    return b"%PDF-1.4\n1 0 obj <</Type /Page>> endobj\nBT (Revenue is 10800000) Tj ET\n%%EOF"


def test_pdf_provenance_is_page_level():
    candidate = PDFExtractor().extract("artifact", "extract", pdf_bytes())[0]
    assert candidate.source.location.page == 1
    assert candidate.source.location.region == "text-1"


def test_xlsx_preserves_sheet_cell_and_formula_result_identity():
    candidate = XLSXExtractor().extract("artifact", "extract", xlsx_bytes())[0]
    assert (candidate.source.location.sheet, candidate.source.location.cell) == ("P&L", "F27")
    assert candidate.formula == "=SUM(F10:F26)"
    assert candidate.raw_value == "1250000"
    assert candidate.value_kind == "FORMULA_RESULT"


def test_csv_preserves_row_column_and_does_not_turn_missing_into_zero():
    candidates = CSVExtractor().extract("artifact", "extract", b"Revenue,Cost\n10,\n")
    assert len(candidates) == 1
    assert (candidates[0].source.location.row, candidates[0].source.location.column) == (
        2,
        "Revenue",
    )


@pytest.fixture
def service(tmp_path):
    database = tmp_path / "cases.sqlite"
    cases = SQLiteSessionStore(database)
    evidence = EvidenceService(
        cases, EvidenceRepository(database), LocalArtifactStore(tmp_path / "objects")
    )
    return cases, evidence, database


def test_hash_filename_independence_unverified_admission_and_idempotency(service):
    cases, evidence, _ = service
    case = cases.create(
        RuntimeMode.LIVE, empty_projection(), owner_id="owner-a", tenant_id="tenant"
    )
    first = evidence.register(
        case_id=case.case_id,
        owner_id="owner-a",
        tenant_id="tenant",
        filename="report.csv",
        media_type="text/csv",
        content=b"Revenue\n10\n",
        command_id="register-1",
    )
    replay = evidence.register(
        case_id=case.case_id,
        owner_id="owner-a",
        tenant_id="tenant",
        filename="renamed.csv",
        media_type="text/csv",
        content=b"Revenue\n10\n",
        command_id="register-2",
    )
    different = evidence.register(
        case_id=case.case_id,
        owner_id="owner-a",
        tenant_id="tenant",
        filename="report.csv",
        media_type="text/csv",
        content=b"Revenue\n12\n",
        command_id="register-3",
    )
    assert first["artifact"]["content_hash"] == replay["artifact"]["content_hash"]
    assert replay["duplicate"] is True
    assert different["artifact"]["id"] != first["artifact"]["id"]
    projection = evidence.process(
        case_id=case.case_id,
        artifact_id=first["artifact"]["id"],
        owner_id="owner-a",
        command_id="process-1",
    )
    replay_projection = evidence.process(
        case_id=case.case_id,
        artifact_id=first["artifact"]["id"],
        owner_id="owner-a",
        command_id="process-2",
    )
    assert len(projection["unverified_evidence"]) == 1
    assert projection["validated_evidence"] == []
    assert len(replay_projection["unverified_evidence"]) == 1


def test_ownership_recovery_validation_and_unknown_resolution_history(service):
    cases, evidence, database = service
    case = cases.create(
        RuntimeMode.LIVE, empty_projection(), owner_id="owner-a", tenant_id="tenant"
    )
    registered = evidence.register(
        case_id=case.case_id,
        owner_id="owner-a",
        tenant_id="tenant",
        filename="facts.csv",
        media_type="text/csv",
        content=b"Revenue\n10\n",
        command_id="r",
    )
    artifact_id = registered["artifact"]["id"]
    with pytest.raises((EvidenceAccessError, KeyError)):
        evidence.process(
            case_id=case.case_id, artifact_id=artifact_id, owner_id="owner-b", command_id="x"
        )
    projection = evidence.process(
        case_id=case.case_id, artifact_id=artifact_id, owner_id="owner-a", command_id="p"
    )
    candidate_id = projection["unverified_evidence"][0]["id"]
    admitted = evidence.validate(
        case_id=case.case_id,
        candidate_id=candidate_id,
        owner_id="owner-a",
        command_id="v",
        outcome=AdmissionStatus.VALIDATED_EVIDENCE,
        rationale="Reviewed against audited statement",
        expected_version=0,
    )
    assert admitted["state_version"] == 1
    recovered = EvidenceRepository(database)
    assert recovered.evidence(case.case_id)[0].candidate_id == candidate_id
    assert recovered.validations(case.case_id)[0].case_version == 1


def test_conflicting_evidence_creates_structured_contradiction_and_targeted_question(service):
    cases, evidence, _ = service
    case = cases.create(
        RuntimeMode.LIVE, empty_projection(), owner_id="owner-a", tenant_id="tenant"
    )
    for index, value in enumerate((b"Revenue\n10\n", b"Revenue\n12\n"), start=1):
        registered = evidence.register(
            case_id=case.case_id,
            owner_id="owner-a",
            tenant_id="tenant",
            filename=f"source-{index}.csv",
            media_type="text/csv",
            content=value,
            command_id=f"register-{index}",
        )
        projection = evidence.process(
            case_id=case.case_id,
            artifact_id=registered["artifact"]["id"],
            owner_id="owner-a",
            command_id=f"process-{index}",
        )
    assert len(projection["evidence_contradictions"]) == 1
    assert projection["evidence_next_best_question"].startswith("Which source")
    assert len(projection["unverified_evidence"]) == 2
