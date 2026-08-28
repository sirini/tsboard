import js from "@eslint/js"
import { withVueTs, vueTsConfigs } from "@vue/eslint-config-typescript"
import prettier from "eslint-config-prettier/flat"
import pluginVue from "eslint-plugin-vue"

export default withVueTs(
  { ignores: ["dist/**", "node_modules/**"] },
  js.configs.recommended,
  pluginVue.configs["flat/essential"],
  vueTsConfigs.recommended,
  {
    files: ["scripts/**/*.mjs"],
    languageOptions: {
      globals: { console: "readonly", fetch: "readonly", process: "readonly", URL: "readonly" },
    },
  },
  {
    rules: {
      "max-lines": ["error", { max: 400 }],
      "max-lines-per-function": ["error", { max: 100, skipBlankLines: false, skipComments: false }],
      "vue/multi-word-component-names": "off",
    },
  },
  prettier,
)
