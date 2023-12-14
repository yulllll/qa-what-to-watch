const { defineConfig } = require('cypress');
const { writeFileSync } = require('fs');

module.exports = defineConfig({
  e2e: {
    baseUrl: 'http://localhost:5173',
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
    apiServer: 'https://13.design.pages.academy/wtw',
    staticServer: 'https://13.design.pages.academy/static',
    filmId: 7,
  }
})
