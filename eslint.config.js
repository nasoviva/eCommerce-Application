import { defineConfig } from "eslint/config";
import js from "@eslint/js";
import parser from "@typescript-eslint/parser";
import pluginTs from "@typescript-eslint/eslint-plugin";
import eslintConfigPrettier from "eslint-config-prettier/flat";
import eslintPluginUnicorn from "eslint-plugin-unicorn";
import globals from "globals";

export default defineConfig([
  js.configs.recommended,
  {
    files: ["**/*.{js,ts,mjs,cjs}"],
    ignores: ["dist/**", "node_modules/**"],
    languageOptions: {
      parser,
      parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
      },
      globals: {
        ...globals.builtin,
        ...globals.browser,
        ...globals.node,
      },
    },
    plugins: {
      "@typescript-eslint": pluginTs,
      unicorn: eslintPluginUnicorn,
    },
    rules: {
      "@typescript-eslint/consistent-type-assertions": [
        "error",
        {
          assertionStyle: "never",
        },
      ],
      "@typescript-eslint/consistent-type-imports": "error",
      "@typescript-eslint/explicit-function-return-type": "error",
      "@typescript-eslint/explicit-member-accessibility": [
        "error",
        { accessibility: "explicit", overrides: { constructors: "off" } },
      ],
      "@typescript-eslint/member-ordering": "error",
      "@typescript-eslint/no-unused-vars": [
        "error",
        { varsIgnorePattern: "^_" },
      ],
      "class-methods-use-this": "error",
      "unicorn/better-regex": "error",
      "unicorn/consistent-function-scoping": "error",
      "unicorn/no-array-method-this-argument": "error",
    },
    linterOptions: {
      noInlineConfig: true,
      reportUnusedDisableDirectives: true,
    },
  },
  eslintConfigPrettier,
]);
