import globals from "globals";
import pluginJs from "@eslint/js";
import tseslint from "typescript-eslint";
import pluginReact from "eslint-plugin-react";

export default [
  { files: ["**/*.{js,mjs,cjs,ts,jsx,tsx}"] },
  { languageOptions: { globals: globals.browser } },
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  pluginReact.configs.flat.recommended,
];

// OLD

// {
//   "env": {
//     "browser": true,
//     "es2020": true,
//     "node": true,
//     "serviceworker": true
//   },
//   "extends": [
//     "eslint:recommended",
//     "plugin:react/recommended",
//     "plugin:jsx-a11y/recommended"
//   ],
//   "globals": {
//     "__PATH_PREFIX__": "readonly"
//   },
//   "parser": "@babel/eslint-parser",
//   "rules": {
//     "arrow-parens": ["warn", "as-needed"],
//     "comma-dangle": ["error", "never"],
//     "function-paren-newline": "off",
//     "no-console": 0,
//     "no-param-reassign": 0,
//     "require-jsdoc": "off"
//   },
//   "settings": {
//     "react": {
//       "version": "detect"
//     }
//   }
// }
