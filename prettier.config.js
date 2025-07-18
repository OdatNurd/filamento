/******************************************************************************/

export default {
  // ---------- General Options ----------
  printWidth: 110,
  tabWidth: 2,
  useTabs: false,
  semi: true,
  singleQuote: true,
  quoteProps: 'as-needed',
  jsxSingleQuote: false,
  trailingComma: 'all',
  bracketSpacing: true,
  bracketSameLine: false,
  arrowParens: 'avoid',
  endOfLine: 'lf',

  // ---------- Pragma Options ----------
  requirePragma: false,
  insertPragma: false,

  // ---------- Prose Wrap Options (for Markdown) ----------
  proseWrap: 'preserve',

  // ---------- HTML, Vue, Angular Options ----------
  htmlWhitespaceSensitivity: 'css',
  vueIndentScriptAndStyle: false,

  // ---------- Embedded Language Formatting ----------
  embeddedLanguageFormatting: 'auto',

  // ---------- JSX Options ----------
  singleAttributePerLine: false,

  plugins: ['prettier-plugin-organize-imports'],
};

/******************************************************************************/
