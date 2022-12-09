const { defineConfig } = require('cypress')

module.exports = defineConfig({
  e2e: {
    baseUrl: 'https://localhost:3000',
    supportFile: false,
    reporter: 'mochawesome',
  },
  env: {
    apiServer: 'https://10.react.pages.academy/wtw',
    filmId: 7,
  }
})
