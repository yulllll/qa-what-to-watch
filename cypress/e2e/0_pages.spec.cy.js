describe('1.1. Страницы приложения', () => {

  it('Main', async () => {
    cy.visit('/');
    cy.contains('404').should('not.exist'); // будет ли у всех 404 на странице?
  });

  it('Sign In', async () => {
    cy.visit('/');
    cy.contains('404').should('not.exist');
  });

  it('MyList', async () => {
    cy.visit('/');
    cy.contains('404').should('not.exist');
  });

  it('Film', async () => {
    cy.visit('/');
    cy.contains('404').should('not.exist');
  });

  it('Add review', async () => {
    cy.visit('/');
    cy.contains('404').should('not.exist');
  });

  it('Player', async () => {
    cy.visit('/');
    cy.contains('404').should('not.exist');
  });
})
