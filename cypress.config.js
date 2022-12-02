const { defineConfig } = require('cypress')

module.exports = defineConfig({
  e2e: {
    baseUrl: 'https://1841149-what-to-watch-10.vercel.app/',
    supportFile: false,
  },
  env: {
    apiServer: 'https://10.react.pages.academy/wtw',
    filmId: 7,
  }
})
