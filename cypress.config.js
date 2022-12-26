const { defineConfig } = require('cypress');
const { writeFileSync } = require('fs');

module.exports = defineConfig({
  e2e: {
    baseUrl: 'http://localhost:3000',
    supportFile: false,
    reporter: 'mochawesome',
    chromeWebSecurity: false,
    setupNodeEvents(on, config) {
      on('after:run', (results) => {
        writeFileSync('./result.txt', results.totalPassed + ' из ' + results.totalTests + ' пройдены');
        writeFileSync('./results_all.txt', process.env.STUDENT + ' - ' + results.totalPassed + ' из ' + results.totalTests + '\n', { flag: 'a' });
      });
    }
  },
  env: {
    apiServer: 'https://10.react.pages.academy/wtw',
    filmId: 7,
  }
})
