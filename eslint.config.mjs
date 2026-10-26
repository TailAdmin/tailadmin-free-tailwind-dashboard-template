import js from "@eslint/js";
import prettier from "eslint-config-prettier";
import globals from "globals";

export default [
  // 1. Global ignores
  {
    ignores: ["build/", "node_modules/"],
  },

  // 2. Source JS files (ES modules, browser environment)
  {
    ...js.configs.recommended,
    files: ["src/js/**/*.js"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: {
        ...globals.browser,
      },
    },
    rules: {
      // --- Bug prevention (errors) ---
      "no-unused-vars": [
        "warn",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
          caughtErrorsIgnorePattern: "^_",
        },
      ],
      "no-undef": "error",
      "no-unreachable": "error",
      "no-constant-condition": "warn",
      "no-debugger": "warn",
      "no-duplicate-case": "error",
      "no-empty": ["warn", { allowEmptyCatch: true }],
      "no-extra-boolean-cast": "warn",
      "no-irregular-whitespace": "error",
      "no-sparse-arrays": "error",

      // --- Best practices (warnings) ---
      eqeqeq: ["warn", "smart"],
      "no-eval": "error",
      "no-implied-eval": "error",
      "no-new-wrappers": "error",
      "no-self-compare": "warn",
      "no-throw-literal": "warn",
      "no-useless-concat": "warn",
      "no-useless-return": "warn",
      "prefer-const": ["warn", { destructuring: "all" }],
    },
  },

  // 3. Root config files (CommonJS, Node environment)
  {
    ...js.configs.recommended,
    files: ["webpack.config.js", "postcss.config.js"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "commonjs",
      globals: {
        ...globals.node,
      },
    },
    rules: {
      "no-unused-vars": [
        "warn",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
        },
      ],
    },
  },

  // 4. Disable formatting rules that conflict with Prettier (must be last)
  prettier,
];
