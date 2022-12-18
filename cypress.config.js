const { defineConfig } = require('cypress')

module.exports = defineConfig({
  e2e: {
    baseUrl: 'http://localhost:3000',
    supportFile: false,
    reporter: 'mochawesome',
    chromeWebSecurity: false,
  },
  env: {
    apiServer: 'https://10.react.pages.academy/wtw',
    filmId: 7,
  }
})
