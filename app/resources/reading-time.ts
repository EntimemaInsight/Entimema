import { readFileSync } from "node:fs";
import { join } from "node:path";
import ts from "typescript";

const WORDS_PER_MINUTE = 220;
const NON_CONTENT_ATTRIBUTES = new Set(["className", "href", "id", "key", "src", "style"]);

/** Calculates reading time from the article component's body JSX at build time. */
export function calculateReadingMinutes(fileName: string) {
  const source = readFileSync(join(process.cwd(), "app", "resources", fileName), "utf8");
  const file = ts.createSourceFile(fileName, source, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
  const article = file.statements.find(
    (node): node is ts.FunctionDeclaration => ts.isFunctionDeclaration(node) && Boolean(node.name?.text.endsWith("Article")),
  );
  if (!article?.body) throw new Error(`Article body not found in ${fileName}`);

  const parts: string[] = [];
  const visit = (node: ts.Node) => {
    if (ts.isJsxText(node)) {
      parts.push(node.text);
      return;
    }
    if (ts.isJsxAttribute(node) && NON_CONTENT_ATTRIBUTES.has(node.name.getText(file))) return;
    if (ts.isStringLiteral(node) || ts.isNoSubstitutionTemplateLiteral(node) || ts.isNumericLiteral(node)) {
      parts.push(node.text);
      return;
    }
    ts.forEachChild(node, visit);
  };
  visit(article.body);

  const words = parts.join(" ").trim().split(/\s+/u).filter(Boolean).length;
  return Math.max(1, Math.round(words / WORDS_PER_MINUTE));
}
