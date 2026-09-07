import type { ModelStatement, Statement } from "./contract";
import type { Source } from "./reader";
import { sourceRef } from "./reader";
import { normalizePeriodDeclaration } from "./periods";
import { reject } from "./diagnostics";

export function bindSourceValues(
  model: ModelStatement,
  source: Source,
): Statement {
  const bound: Statement = {
    ...model,
    lines: model.lines.map((line, i) => ({
      ...line,
      values: line.values.map((value, j) => {
        const path = `lines[${i}].values[${j}].sourceRef`;
        let reference = value.sourceRef;
        if (source.format === "spreadsheet" && !source.cells.has(reference)) {
          // Only a fully qualified, exact sheet name plus one A1 cell is eligible.
          const match = reference.match(/^(.+)!([A-Z]+[1-9]\d*)$/);
          if (
            match &&
            [...source.cells.values()].some((cell) => cell.sheet === match[1])
          )
            reference = sourceRef(match[1], match[2]);
        }
        const validFormat =
          source.format === "pdf"
            ? /^p[1-9]\d*:l[1-9]\d*:t[1-9]\d*$/.test(reference)
            : /^'(?:[^']|'')+'![A-Z]+[1-9]\d*$/.test(reference);
        if (!validFormat)
          reject(
            "SOURCE_REF_FORMAT",
            path,
            "qualified source reference",
            "invalid format",
            "schema_contract",
          );
        const cell = source.cells.get(reference);
        if (!cell)
          reject(
            "SOURCE_REF_NOT_FOUND",
            path,
            "existing source cell",
            "missing reference",
          );
        if (cell.numeric === null)
          reject(
            "SOURCE_NOT_NUMERIC",
            path,
            "numeric source cell",
            "non-numeric source",
            "source_value",
          );
        return { ...value, sourceRef: reference, value: cell.numeric };
      }),
    })),
  };
  return normalizePeriodDeclaration(bound, source);
}
