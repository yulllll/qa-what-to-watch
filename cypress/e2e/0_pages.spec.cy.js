import {enableMocks, setNoAuth, filmId, Path} from '../utils/enableMocks';
import promo from '../fixtures/film.json';


describe('0. Страницы приложения', () => {
  beforeEach(() => {
    enableMocks();
  });

  it('Main', () => {
    cy.visit('/');
    cy.get('.user-block__avatar img').should('have.attr', 'src', 'https://10.react.pages.academy/static/avatar/3.jpg');
    cy.get('.user-block__link').should('have.text', 'Sign out');
    cy.contains(promo.name).should('exist');

    setNoAuth();
    cy.visit('/');
    cy.get('.user-block__link').should('have.text', 'Sign in');
  });

  it('Sign In', () => {
    cy.visit(Path.LOGIN);
    cy.get('.sign-in__btn').contains('Sign in').should('exist');
  });

  it('MyList', () => {
    cy.visit(Path.MY_LIST);
    cy.get('.user-block__avatar img').should('have.attr.src', 'https://10.react.pages.academy/static/avatar/3.jpg');
    cy.get('.user-block__link').should('have.text', 'Sign out');
    cy.get('.catalog').should('exist');
    
    setNoAuth();
    cy.visit(Path.MY_LIST);
    cy.url()
      .should('contain', Path.LOGIN)
  });

  it('Film', () => {
    cy.visit(Path.FILM);
    cy.get('.user-block__avatar img').should('have.attr.src', 'https://10.react.pages.academy/static/avatar/3.jpg');
    cy.get('.user-block__link').should('have.text', 'Sign out');
    cy.get('.film-card__title').contains('Moonrise Kingdom').should('exist');
  
    setNoAuth();
    cy.visit(Path.FILM);
    cy.get('.user-block__link').should('have.text', 'Sign in');
  });

  it('Add review', () => {
    cy.visit(Path.REVIEW);
    cy.get('.user-block__avatar img').should('have.attr.src', 'https://10.react.pages.academy/static/avatar/3.jpg');
    cy.get('.user-block__link').should('have.text', 'Sign out');
    
    setNoAuth();
    cy.visit(Path.REVIEW);
    cy.url()
      .should('contain', Path.LOGIN);
  });

  it('Player', () => {
    cy.visit(Path.PLAYER);
    cy.get('.player').should('exist');
  });

  it('404', () => {
    cy.visit(`/404`);
    cy.get('.catalog').should('not.exist');
  });
});
