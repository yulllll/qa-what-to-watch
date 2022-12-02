import {enableMocks, setNoAuth, filmId} from '../utils/enableMocks';
import promoData from '../fixtures/promo.json';


describe('0. Страницы приложения', () => {
  beforeEach(() => {
    enableMocks();
  });

  it('Main', () => {
    cy.visit('/');
    // todo раскомментироть (ошибка в работе студента)
    // cy.get('.user-block__avatar img').should('have.attr', 'src', 'https://10.react.pages.academy/static/avatar/3.jpg');
    cy.get('.user-block__link').should('have.text', 'Sign out');
    cy.contains(promo.name).should('exist');

    setNoAuth();
    cy.visit('/');
    cy.get('.user-block__link').should('have.text', 'Sign in');
  });

  it('Sign In', () => {
    cy.visit('/login');
    cy.get('.sign-in__btn').contains('Sign in').should('exist');
  });

  it('MyList', () => {
    cy.visit('/mylist');
    // cy.get('.user-block__avatar img').should('have.attr.src', 'https://10.react.pages.academy/static/avatar/3.jpg');
    cy.get('.user-block__link').should('have.text', 'Sign out');
    cy.get('.catalog').should('exist');
    
    setNoAuth();
    cy.visit('/mylist');
    cy.url()
      .should('contain', '/login')
  });

  it('Film', () => {
    cy.visit(`/films/${filmId}`);
    // cy.get('.user-block__avatar img').should('have.attr.src', 'https://10.react.pages.academy/static/avatar/3.jpg');
    cy.get('.user-block__link').should('have.text', 'Sign out');
    cy.get('.film-card__title').contains('Moonrise Kingdom').should('exist');
  
    setNoAuth();
    cy.visit(`/films/${filmId}`);
    cy.get('.user-block__link').should('have.text', 'Sign in');
  });

  it('Add review', () => {
    cy.visit(`/films/${filmId}/review`);
    // cy.get('.user-block__avatar img').should('have.attr.src', 'https://10.react.pages.academy/static/avatar/3.jpg');
    cy.get('.user-block__link').should('have.text', 'Sign out');
    
    setNoAuth();
    cy.visit(`/films/${filmId}/review`);
    cy.url()
      .should('contain', '/login');
  });

  it('Player', () => {
    cy.visit(`/player/${filmId}`);
    cy.get('.player').should('exist');
  });

  it('404', () => {
    cy.visit(`/404`);
    cy.get('.logo').should('exist');
  });
});
