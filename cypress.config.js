const { defineConfig } = require('cypress');
import {writeFileSync} from 'fs';

module.exports = defineConfig({
  e2e: {
    baseUrl: 'http://localhost:3000',
    supportFile: false,
    reporter: 'mochawesome',
    chromeWebSecurity: false,
    setupNodeEvents(on, config) {
      on('after:run', (results) => {
        writeFileSync('./result.txt', results.totalPassed + ' из '+results.totalTests + ' пройдены');
      });
    }
  },
  env: {
    apiServer: 'https://10.react.pages.academy/wtw',
    filmId: 7,
  }
})
