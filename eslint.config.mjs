import { FlatCompat } from '@eslint/eslintrc'
import { dirname } from 'path'

import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const compat = new FlatCompat({
  baseDirectory: __dirname,
})

const eslintConfig = [
  ...compat.extends(
    'next/core-web-vitals',
    'next/typescript',
    'plugin:tailwindcss/recommended',
    'plugin:prettier/recommended',
    'prettier',
  ),
  {
    rules: {
      'no-dupe-imports': 'off',
      'tailwindcss/no-custom-classname': 'off', // Allow custom Tailwind classes
      'no-unknown-animations': 'off', // Prevent false animation warnings
      'at-rule-no-unknown': [
        'warn',
        {
          ignoreAtRules: ['apply', 'variants', 'responsive', 'screen'],
        },
      ],
      '@typescript-eslint/no-explicit-any': 'warn',
      /* ////// */
      'prettier/prettier': 'error',
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      'no-unused-vars': 'off', // Prevent duplicate unused variable warnings
      'prettier/prettier': [
        'error',
        {
          singleQuote: true,
          semi: false,
          trailingComma: 'es5',
          printWidth: 100,
        },
      ],
      'tailwindcss/no-custom-classname': 'off', // Allow custom Tailwind classes
      'no-unknown-animations': 'off', // Prevent false animation warnings
      'at-rule-no-unknown': [
        'warn',
        {
          ignoreAtRules: ['apply', 'variants', 'responsive', 'screen'],
        },
      ],
      '@typescript-eslint/no-explicit-any': 'warn',
    },
    settings: {
      tailwindcss: {
        callees: ['cn'], // Add support for custom class utilities (if using `clsx` or `cn`)
      },
    },
  },
]

export default eslintConfig
