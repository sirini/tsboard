import eslintPluginVue from 'eslint-plugin-vue';

export default [
  {
    files: ['**/*.vue'],
    plugins: {
      vue: eslintPluginVue,
    },
    rules: {
      // Vue 관련 규칙 설정
    },
  },
];