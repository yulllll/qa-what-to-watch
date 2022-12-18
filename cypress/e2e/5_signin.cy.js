import joinUrl from 'url-join';
import { enableMocks, Path, setNoAuth } from '../utils/enableMocks';
import data from '../fixtures/login.json';

describe('Страница Sign In', () => {
    beforeEach(() => {
        enableMocks();
        setNoAuth();
        cy.visit(Path.LOGIN);
        cy.get('.sign-in__input[type="email"]').as('email');
        cy.get('.sign-in__input[type="password"]').as('password');
        cy.intercept(
            'POST',
            joinUrl(Cypress.env('apiServer'), Path.LOGIN),
            {
                statusCode: 200,
                body: data,
            }).as('loginSuccess');
    });

    it('Валидация формы', () => {
        cy.get('@email').type('invalid_email');
        cy.get('.sign-in__btn').click();
        cy.get('@loginSuccess').should('not.exist');

        cy.get('@email').clear();
        cy.get('@email').type('valid@email.com');
        cy.get('@loginSuccess').should('not.exist');

        cy.get('@password').type(' ');
        cy.get('.sign-in__btn').click();
        cy.get('@loginSuccess').should('not.exist');


        cy.get('@email').clear();
        cy.get('@password').type('invalid');
        cy.get('.sign-in__btn').click();
        cy.get('@loginSuccess').should('not.exist');

        cy.get('@email').clear();
        cy.get('@password').type('123');
        cy.get('.sign-in__btn').click();
        cy.get('@loginSuccess').should('not.exist');
    });

    it('Отправка формы', () => {

        cy.get('@email').type('valid@email.com');
        cy.get('@password').type('123valid');
        cy.get('.sign-in__btn').click();

        cy.get('@loginSuccess').then(interception => {
            expect(interception.response.statusCode).to.equal(200);
        });
        cy.url().should('contain', '/');
    });

    it('Обработка ошибки', () => {
        cy.intercept('POST', joinUrl(Cypress.env('apiServer'), Path.LOGIN), { statusCode: 500 }).as('loginFail');
        cy.visit(Path.LOGIN);

        cy.get('@email').type('valid@email.com');
        cy.get('@password').type('123valid');
        cy.get('.sign-in__btn').click();

        cy.get('@loginFail').then(interception => {
            expect(interception.response.statusCode).to.be.equal(500);
        });
    });

    it('Для авторизованных', () => {
        enableMocks();
        cy.visit(Path.LOGIN);
        cy.url().should('contain', '/');
    });
});