import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";
import pluginReact from "eslint-plugin-react";
import { defineConfig } from "eslint/config";


export default defineConfig([
  {
    files: ["**/*.{js,mjs,cjs,ts,jsx,tsx}"], plugins: { js }, extends: ["plugin:prettier/recommended"], rules: {
      semi: ["error", "never"]
    }
  },
  {
    files: ["**/*.{js,mjs,cjs,ts,jsx,tsx}"], languageOptions: { globals: globals.browser }, rules: {
      semi: ["error", "never"]
    }
  },
  tseslint.configs.recommended,
  pluginReact.configs.flat.recommended,
]);
