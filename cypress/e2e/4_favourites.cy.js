import { enableMocks, Path } from '../utils/enableMocks';
import favourites from '../fixtures/favorite.json';

describe('Страница MyList', () => {
    beforeEach(() => {
        enableMocks();
    });

    it('Переход на страницу', () => {
        cy.visit('/');
        cy.get('.user-block__avatar').click();
        cy.url().should('contain', Path.MY_LIST);
    });

    it('Проверка страницы', () => {
        cy.visit(Path.MY_LIST);
        cy.get('.catalog__films-card').should('have.length', favourites.length > 8 ? 8 : favourites.length);  
        cy.get('.catalog__films-card:first-child').click(); 
        cy.url().should('contain', `/films/${favourites[0].id}`);     
    });
});