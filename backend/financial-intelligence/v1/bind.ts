import type { ModelStatement, Statement } from "./contract";
import type { Source } from "./reader";
import { reject } from "./diagnostics";

export function bindSourceValues(
  model: ModelStatement,
  source: Source,
): Statement {
  return {
    ...model,
    lines: model.lines.map((line, i) => ({
      ...line,
      values: line.values.map((value, j) => {
        const path = `lines[${i}].values[${j}].sourceRef`;
        const validFormat =
          source.format === "pdf"
            ? /^p[1-9]\d*:l[1-9]\d*:t[1-9]\d*$/.test(value.sourceRef)
            : /^'(?:[^']|'')+'![A-Z]+[1-9]\d*$/.test(value.sourceRef);
        if (!validFormat)
          reject(
            "SOURCE_REF_FORMAT",
            path,
            "qualified source reference",
            "invalid format",
            "schema_contract",
          );
        const cell = source.cells.get(value.sourceRef);
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
        return { ...value, value: cell.numeric };
      }),
    })),
  };
}
