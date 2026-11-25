const js = require("@eslint/js");
const globals = require("globals");
const { defineConfig, globalIgnores } = require("eslint/config");

module.exports = defineConfig([
  globalIgnores(["node_modules", "coverage", "build"]),
  {
    files: ["**/*.js"],
    extends: [js.configs.recommended],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "commonjs",
      globals: globals.node,
    },
  },
  {
    files: ["**/*.test.js", "tests/**/*.js"],
    languageOptions: {
      globals: { ...globals.node, ...globals.jest },
    },
  },
]);
