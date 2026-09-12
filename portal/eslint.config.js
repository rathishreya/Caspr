import js from '@eslint/js';
import reactHooks from 'eslint-plugin-react-hooks';
import globals from 'globals';
import tseslint from 'typescript-eslint';

/**
 * eslint 9, flat config. Matches `caspr-app`'s setup, per build spec §5.
 *
 * The three custom rules at the bottom are not style preferences — each one is a design
 * rule that would otherwise depend on somebody remembering it in review.
 */
export default tseslint.config(
  {
    ignores: ['**/.next/**', '**/node_modules/**', '**/dist/**', '**/migrations/**', '**/*.css'],
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    languageOptions: {
      ecmaVersion: 2023,
      sourceType: 'module',
      globals: { ...globals.node, ...globals.browser },
    },
    rules: {
      '@typescript-eslint/consistent-type-imports': ['error', { fixStyle: 'inline-type-imports' }],
      '@typescript-eslint/no-unused-vars': [
        'error',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
      ],
      eqeqeq: ['error', 'always', { null: 'ignore' }],
      'no-console': ['error', { allow: ['warn', 'error'] }],
      'prefer-const': 'error',
      'object-shorthand': 'error',
    },
  },
  {
    files: ['apps/console/**/*.tsx'],
    plugins: { 'react-hooks': reactHooks },
    rules: reactHooks.configs.recommended.rules,
  },
  {
    /**
     * ⛔ No hardcoded colour outside the tokens package.
     *
     * Design spec §3: "Values are canonical; do not hardcode hex." A hex that creeps into
     * a component is how a palette stops being one, and it is invisible in review because
     * it renders correctly on the day it is written.
     */
    files: ['apps/**/*.{ts,tsx}', 'packages/db/**/*.ts', 'packages/domain/**/*.ts'],
    rules: {
      'no-restricted-syntax': [
        'error',
        {
          selector: "Literal[value=/^#(?:[0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/]",
          message:
            'Hardcoded colour. Use a token from @caspr-portal/tokens — design spec §3 forbids literal hex outside the token package.',
        },
      ],
    },
  },
  {
    files: ['**/*.test.ts', '**/*.test.tsx'],
    rules: { 'no-restricted-syntax': 'off' },
  },
  {
    files: ['packages/tokens/**/*.ts'],
    rules: { 'no-restricted-syntax': 'off' },
  },
);
