import joinUrl from 'url-join';
import dayjs from 'dayjs';
import { getRatingLevel } from '../utils/getRatingLevel';
import { enableMocks, filmId, Alias, Path } from '../utils/enableMocks';
import film from '../fixtures/film.json';
import favoriteData from '../fixtures/favorite.json';
import similar from '../fixtures/similar.json';
import comments from '../fixtures/comments.json';

describe('2. Страница фильма', () => {
    beforeEach(() => {
        enableMocks();
        cy.visit(Path.FILM);
        if (film.id !== filmId) {
            throw new Error('invalid mocks');
        }
    });

    // it('Постер abkmvf', () => {
    //     cy.get('.film-card__poster img').should('have.attr', 'src', film.posterImage);
    //     cy.get('.film-card__poster img').should('have.attr', 'alt');
    //     cy.get('.film-card__title').should('have.text', film.name);
    //     cy.get('.film-card__year').should('have.text', film.released);
    // });

    // it('Воспроизведение фильма', () => {
    //     cy.get('.btn--play').click();
    //     cy.url()
    //         .should('contain', `/player/${film.id}`);
    // });

    // it('Избранное для фильма', () => {
    //     // проверяем начальное состояние
    //     cy.get('.film-card__count').should('have.text', favoriteData.length);


    //     // далее учитывем сценарии расчета на клиенте и на сервере кол-ва избранных

    //     // первый клик (добавление или удаление)
    //     cy.intercept(joinUrl(Cypress.env('apiServer'), Path.FAVOURITE), (req) => {
    //         req.reply({
    //             statusCode: 200,
    //             body: [...favoriteData, { ...film, isFavorite: !film.isFavorite }].filter(f => f.isFavorite),
    //         });
    //     });
    //     cy.get('.btn--list').click();
    //     cy.wait(`@${Alias.FAVOURITE}`).then((interception) => {
    //         expect(interception.response.body.isFavorite).to.be.equal(!film.isFavorite);
    //     });
    //     cy.get('.film-card__count').should('have.text', favoriteData.length + (film.isFavorite ? 0 : 1));

    //     // повторный клик (возвращаем в начальное состояние)
    //     cy.intercept(joinUrl(Cypress.env('apiServer'), Path.FAVOURITE), (req) => {
    //         req.reply({
    //             statusCode: 200,
    //             body: [...favoriteData, { ...film, isFavorite: film.isFavorite }].filter(f => f.isFavorite),
    //         });
    //     });
    //     cy.get('.btn--list').click();
    //     cy.wait(`@${Alias.FAVOURITE}`).then((interception) => {
    //         expect(interception.response.body.isFavorite).to.be.equal(film.isFavorite);
    //     });
    //     cy.get('.film-card__count').should('have.text', favoriteData.length + (film.isFavorite ? 1 : 0));
    // });

    it('Общая информация', () => {
        cy.get('.film-nav__item:nth-child(1)').should('have.class', 'film-nav__item--active');

        cy.get('.film-card__text').should('contain', film.description);
        cy.get('.film-rating__score').should('contain', film.rating);
        cy.get('.film-rating__level').should('contain', getRatingLevel(film.rating));
        cy.get('.film-rating__count').should('contain', film.scoresCount);
        cy.get('.film-card__director').should('contain', film.director);

        film.starring.slice(0, 3).forEach((actor) => {
            cy.get('.film-card__starring').should('contain', actor);
        });
        if (film.starring.length > 3) {
            cy.get('.film-card__starring').should('contain', 'others');
        }
    });

    it('Расширенная информация', () => {
        cy.get('.film-nav__item:nth-child(2)').click();
        cy.get('.film-nav__item:nth-child(2)').should('have.class', 'film-nav__item--active');

        cy.get('.film-card__details-value').should('contain', film.director);
        film.starring.forEach((actor) => {
            cy.get('.film-card__details-value').should('contain', actor);
        });
        // Длительность
        const hours = Math.floor(film.runTime / 60);
        const minutes = film.runTime % 60;
        cy.get('.film-card__details-value').contains(`${hours}h ${minutes}m`).should('exist');
        // Жанр
        cy.get('.film-card__details-value').contains(film.genre).should('exist');
        // Дата релиза
        cy.get('.film-card__details-value').contains(film.released).should('exist');
    });

    it('Список отзывов', () => {
        cy.get('.film-nav__item:nth-child(3)').click();
        cy.get('.film-nav__item:nth-child(3)').should('have.class', 'film-nav__item--active');
        comments.forEach(comment => {
            const date = dayjs(comment.date);
            cy.get('.review__author').should('contain', comment.user.name);
            cy.get('.review__text').should('contain', comment.comment);
            cy.get('.review__date').should('contain', date.format('MMMM D, YYYY'));
            // cy.get('.review__date').should('have.attr', 'datetime', date.format('YYYY-MM-DD'));
            cy.get('.review__rating').should('contain', comment.rating);
        });
    });

    it('Оценка фильма', () => {
        [1.2, 4.3, 6.1, 9.32, 10].forEach(rating => {
            const body = { ...film, rating };
            const mark = getRatingLevel(rating);
            cy.intercept(joinUrl(Cypress.env('apiServer'), Path.FILM), { statusCode: 200, body });
            cy.visit(Path.FILM);
            cy.get('.film-rating__level').should('contain', mark);
        });

    });

    it('Похожие фильмы', () => {
        cy.get('.catalog__genres-item').should('have.length.lessThan', 5);
        const similarFilms = similar.filter(s => s.id !== film.id);
        similarFilms.slice(0, 4).forEach((similar, index) => {
            cy.get(`.catalog__films-card:nth-child(${index + 1})`).as('card');
            cy.get('@card').find('.small-film-card__image img').should('have.attr', 'src', similar.previewImage);

            cy.get('@card').trigger('mouseover');
            cy.wait(500);
            cy.get('@card').find('video').should('have.attr', 'src', similar.previewVideoLink);
            cy.get('@card').trigger('mouseleave');
            cy.wait(500);

            cy.get('@card').click();
            cy.url().should('contain', `/films/${similar.id}`);
            cy.visit(Path.FILM);
        });
    });
});