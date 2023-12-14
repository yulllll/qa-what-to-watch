import joinUrl from 'url-join';
import film from '../fixtures/film.json';

export const filmId = Cypress.env('filmId');

export const Path = {
  FILMS: '/films',
  FILM: `/films/${filmId}`,
  SIMILAR: `/films/${filmId}/similar`,
  PROMO: '/promo',
  FAVOURITE: '/favorite',
  COMMENTS: `/comments/${filmId}`,
  LOGIN: '/login',
  MY_LIST: '/mylist',
  REVIEW: `/films/${filmId}/review`,
  PLAYER: `/player/${filmId}`,
}

export const Alias = {
  FILMS: 'films',
  FILM: `films`,
  SIMILAR: `similar`,
  PROMO: 'promo',
  FAVOURITE: 'favourite',
  COMMENTS: `comments`,
  LOGIN: 'login',

}

export const enableMocks = () => {
  cy.intercept(joinUrl(Cypress.env('staticServer'), '/film/video/bubbles.mp4'), { fixture: 'example.mp4,null' });
  cy.intercept(joinUrl(Cypress.env('staticServer'), '/film/video/dog.mp4'), { fixture: 'example.mp4,null' });
  cy.intercept(joinUrl(Cypress.env('apiServer'), Path.FILMS), { fixture: 'films' });
  cy.intercept(joinUrl(Cypress.env('apiServer'), Path.FILM), { fixture: 'film' });
  cy.intercept(joinUrl(Cypress.env('apiServer'), Path.FILM.replace(filmId, '*')), { fixture: 'film' });
  cy.intercept(joinUrl(Cypress.env('apiServer'), Path.SIMILAR), { fixture: 'similar' });
  cy.intercept(joinUrl(Cypress.env('apiServer'), Path.SIMILAR.replace(filmId, '*')), { fixture: 'similar' });
  cy.intercept(joinUrl(Cypress.env('apiServer'), Path.PROMO), { fixture: 'film' });
  cy.intercept(joinUrl(Cypress.env('apiServer'), Path.COMMENTS), { fixture: 'comments' });
  cy.intercept(joinUrl(Cypress.env('apiServer'), Path.COMMENTS.replace(filmId, '*')), { fixture: 'comments' });
  cy.intercept(joinUrl(Cypress.env('apiServer'), Path.FAVOURITE), { fixture: 'favorite' });
  setAuth();
  cy.intercept('POST', joinUrl(Cypress.env('apiServer'), Path.FAVOURITE, '/**'), (req) => {
    if (req.url.endsWith('1')) {
      req.reply({
        statusCode: 200,
        body: { ...film, isFavorite: true },
      });
    } else if (req.url.endsWith('0')) {
      req.reply({
        statusCode: 200,
        body: { ...film, isFavorite: false },
      });
    } else {
      req.reply({
        statusCode: 500,
      });
    }
  }).as(Alias.FAVOURITE);
};

export const setNoAuth = () => {
  cy.clearLocalStorage();
  cy.intercept(joinUrl(Cypress.env('apiServer'), Path.LOGIN), (req) => {
    req.reply({
      statusCode: 401,
    });
  })
};


export const setAuth = () => {
  cy.intercept(joinUrl(Cypress.env('apiServer'), Path.LOGIN), { fixture: 'login' }); 
  window.localStorage.setItem('wtw-token', 'ZGZnaEBmZ2hqLnJ1'); // todo опраемся на токен, который не регламентирован ТЗ и хранится на клиенте, а нет проверки авторизации с бека
};
