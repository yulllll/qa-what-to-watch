export default () => {
  cy.intercept('PUT', joinUrl(Cypress.env('apiServer'), Path.POINTS, '/*'), (req) => {
      req.reply({
        statusCode: 200,
        body: { ...req.body },
      });
    }).as('saveFavourite');
    cy.intercept('DELETE', joinUrl(Cypress.env('apiServer'), Path.POINTS, '/*'), (req) => {
      req.reply({
        statusCode: 200,
        body: req.body,
      });
    cy.intercept(joinUrl(Cypress.env('apiServer'), Path.POINTS), { fixture: 'points' });
}
