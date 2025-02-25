import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript",'plugin:tailwindcss/recommended',
    'plugin:prettier/recommended',
    'prettier'),
    {
      rules: {
        'tailwindcss/no-custom-classname': 'off', // Allow custom Tailwind classes
        'no-unknown-animations': 'off', // Prevent false animation warnings
        'at-rule-no-unknown': [
          'warn',
          {
            ignoreAtRules: ['apply', 'variants', 'responsive', 'screen'],
          },
        ],
        "@typescript-eslint/no-explicit-any": "warn"
      },
      settings: {
        tailwindcss: {
          callees: ['cn'], // Add support for custom class utilities (if using `clsx` or `cn`)
        },
    },
    
    },
];

export default eslintConfig;
