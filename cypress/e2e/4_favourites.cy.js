import { enableMocks, Path, setNoAuth } from '../utils/enableMocks';
import favourites from '../fixtures/favorite.json';
import authByForm from '../utils/authByForm';

describe('Страница MyList', () => {
    it('Переход на страницу', () => {
        enableMocks();
        setNoAuth();
        authByForm();
        cy.get('.user-block__avatar').click();
        cy.url().should('contain', Path.MY_LIST);
    });

    it('Проверка страницы', () => {
        enableMocks();
        cy.visit(Path.MY_LIST);
        cy.get('.catalog__films-card').should('have.length', favourites.length > 8 ? 8 : favourites.length);  
        cy.get('.catalog__films-card:first-child').click(); 
        cy.url().should('contain', `/films/${favourites[0].id}`);     
    });
});