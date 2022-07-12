import { LinterGetOffensesFunction } from "vscode-linter-api";

export interface ActiontlintOffense {
  message: string;
  filepath: string;
  line: number;
  column: number;
  kind: string;
  snippet: string;
}

export const getOffenses: LinterGetOffensesFunction = ({ uri, stdout }) => {
  const regex = /(workflows\/|workflows\\).*(.yml|.yaml)/g;
  if (uri.path.match(regex) === null) {
    return [];
  }
  stdout = stdout.replace(/^'+|'+$/gm, "");
  const payload: ActiontlintOffense[] = JSON.parse(stdout);
  return payload.map((offense) => {
    const lineStart = offense.line - 1;
    const columnStart = offense.column - 1;

    // Line/column end are optional.
    const lineEnd = lineStart;
    const columnEnd = columnStart;

    return {
      uri,
      lineStart,
      columnStart,
      lineEnd,
      columnEnd,
      code: offense.kind,
      message: offense.message,
      source: "actionlint",
      correctable: false,
      severity: 2,
      docsUrl: "https://github.com/rhysd/actionlint/blob/main/docs/checks.md",
    };
  });
};
