import joinUrl from 'url-join';
import { enableMocks, setNoAuth, Path } from '../utils/enableMocks';

const VALID_TEXT = Array.from({ length: 51 }, () => 'a').join('');

describe('Форма отправки отзыва', () => {

    it('Проверка перехода со страницы фильма', () => {
        enableMocks();
        cy.visit(Path.REVIEW);
        cy.visit(Path.FILM);
        cy.contains('Add review').click();
        cy.url().should('contain', Path.REVIEW);

        setNoAuth();
        cy.visit(Path.FILM);
        cy.contains('Add review').should('not.exist');
    });

    it('Валидация', () => {
        enableMocks();
        cy.visit(Path.REVIEW);
        cy.get('.add-review__btn').should('have.attr', 'disabled');

        cy.get('.rating__label:last-child').click();
        cy.get('.add-review__btn').should('have.attr', 'disabled');

        cy.get('.add-review__textarea').type(Array.from({ length: 49 }, () => 'a').join(''));
        cy.get('.add-review__btn').should('have.attr', 'disabled');

        cy.get('.add-review__textarea').clear();
        cy.get('.add-review__textarea').then(([$el]) => {
            if ($el.getAttribute('maxlength') !== 400) {
                cy.get('.add-review__textarea').type(Array.from({ length: 401 }, () => 'a').join(''));
                cy.get('.add-review__btn').should('have.attr', 'disabled');
            }
        });

        cy.get('.add-review__textarea').clear();
        cy.get('.add-review__textarea').type(VALID_TEXT);
        cy.get('.add-review__btn').should('not.have.attr', 'disabled');
    });

    it('Отправка отзыва', () => {
        enableMocks();
        cy.intercept('POST', joinUrl(Cypress.env('apiServer'), Path.COMMENTS), {
            statusCode: 200,
            body: [
                {
                    "comment": VALID_TEXT,
                    "date": "Sun Dec 04 2022 12:15:27 GMT+0300 (Москва, стандартное время)",
                    "id": 1,
                    "rating": 6.0,
                    "user": {
                        "id": 4,
                        "name": "Kate Muir"
                    }
                }
            ],
        }).as('requestSuccess');
        cy.visit(Path.REVIEW);
        cy.get('.rating__label:last-child').click();
        cy.get('.add-review__textarea').type(VALID_TEXT);
        cy.get('.add-review__btn').click();
        cy.get('@requestSuccess').its('response.statusCode').should('eq', 200);
        cy.url().should('contain', Path.FILM);
    });

    it('Обработка ошибки', () => {
        enableMocks();
        cy.visit(Path.REVIEW);
        cy.intercept('POST', joinUrl(Cypress.env('apiServer'), Path.COMMENTS), { statusCode: 500 }).as('requestFail');

        cy.get('.rating__label:last-child').click();
        cy.get('.add-review__textarea').type(VALID_TEXT);
        cy.get('.add-review__btn').click();
        cy.get('@requestFail').its('response.statusCode').should('eq', 500);
        cy.url().should('contain', Path.REVIEW);
    });
});