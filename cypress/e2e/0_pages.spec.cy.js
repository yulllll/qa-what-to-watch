import { enableMocks, setNoAuth, Path } from '../utils/enableMocks';
import promo from '../fixtures/film.json';
import authByForm from '../utils/authByForm';

describe('0. Страницы приложения', () => {
  it('Header Auth', () => {
    enableMocks();
    setNoAuth();
    cy.visit('/');
    cy.get('.user-block__link').should('have.text', 'Sign in');

    authByForm();

    cy.visit('/');
    cy.get('.user-block__link').should('have.text', 'Sign out');
    cy.get('.user-block__avatar img').should('have.attr', 'src', 'https://13.design.pages.academy/static/avatar/3.jpg');

    setNoAuth();
    cy.visit('/');
    cy.get('.user-block__link').should('have.text', 'Sign in');
  });

  it('Main', () => {
    enableMocks();
    cy.visit('/');
    cy.contains(promo.name).should('exist');
  });

  it('Sign In', () => {
    enableMocks();
    setNoAuth();
    cy.visit(Path.LOGIN);
    cy.get('.sign-in__btn').contains('Sign in').should('exist');
  });

  it('MyList', () => {
    enableMocks();
    cy.visit(Path.MY_LIST);
    cy.get('.catalog').should('exist');

    setNoAuth();
    cy.visit(Path.MY_LIST);
    cy.url()
      .should('contain', Path.LOGIN)
  });

  it('Film', () => {
    enableMocks();
    cy.visit(Path.FILM);
    cy.get('.film-card__title').contains('Moonrise Kingdom').should('exist');

    setNoAuth();
    cy.visit(Path.FILM);
    cy.get('.user-block__link').should('have.text', 'Sign in');
  });

  it('Add review', () => {
    enableMocks();
    cy.visit(Path.REVIEW);
    cy.get('.add-review__form').should('exist');

    setNoAuth();
    cy.visit(Path.REVIEW);
    cy.url()
      .should('contain', Path.LOGIN);
  });

  it('Player', () => {
    enableMocks();
    cy.visit(Path.PLAYER);
    cy.get('.player').should('exist');
  });

  it('404', () => {
    enableMocks();
    cy.visit(`/404`);
    cy.get('.catalog').should('not.exist');
  });
});
