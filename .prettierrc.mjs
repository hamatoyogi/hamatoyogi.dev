/** @type {import("prettier").Config} */
const confing = {
  bracketSpacing: true,
  jsxBracketSameLine: false,
  printWidth: 80,
  semi: true,
  singleQuote: true,
  tabWidth: 2,
  trailingComma: 'all',
  useTabs: false,
  plugins: ['prettier-plugin-astro'],
  overrides: [
    {
      files: '*.astro',
      options: {
        parser: 'astro',
        // jsxBracketSameLine: false,
      },
    },
  ],
};

export default confing;
