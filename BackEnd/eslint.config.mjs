import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";
import { defineConfig } from "eslint/config";

export default defineConfig([
  {
    files: ["**/*.{js,mjs,cjs}"], // JS files only
    plugins: { js },
    extends: ["js/recommended"],
    languageOptions: { globals: globals.node },
    rules: {
      "@typescript-eslint/no-require-imports": "off", // 🔴 This rule is from TS plugin, so it won’t affect JS
    },
  },
  {
    files: ["**/*.{ts,cts,mts}"], // TS files only
    ...tseslint.configs.recommended[0], // Use TS rules for TS files
  },
]);
