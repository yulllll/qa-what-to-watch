import joinUrl from 'url-join';
import { enableMocks, Alias, Path } from "../utils/enableMocks";
import toggleFavouriteDecorator from '../utils/toggleFavouriteDecorator';
import promoData from '../fixtures/film.json';
import favoriteData from '../fixtures/favorite.json';
import films from '../fixtures/films.json';

describe('1. Главная страница', () => {

    it('Постер', () => {
        enableMocks();
        cy.visit('/');
        cy.get('.film-card__poster img').should('have.attr', 'src', promoData.posterImage);
        cy.get('.film-card__poster img').should('have.attr', 'alt');
        cy.get('.film-card__title').should('have.text', promoData.name);
        cy.get('.film-card__year').should('have.text', promoData.released);
    });

    it('Воспроизведение промо', () => {
        enableMocks();
        cy.visit('/');
        cy.contains(promoData.name); // хак на ожидание перерендера после загрузки фильма
        cy.get('.btn--play').click();
        cy.url()
         .should('contain', `/player/${promoData.id}`);
    });

    it('Избранное для промо', () => {
        const toggleFavouriteResponse = toggleFavouriteDecorator(promoData, favoriteData);
        enableMocks();

        cy.visit('/');
        cy.get('.film-card__count').should('have.text', favoriteData.length);

        toggleFavouriteResponse();
        cy.get('.btn--list').click();
        cy.get('.film-card__count').should('have.text', favoriteData.length + (promoData.isFavorite ? -1 : 1));

        toggleFavouriteResponse();
        cy.get('.btn--list').click();
        cy.get('.film-card__count').should('have.text', favoriteData.length);
    });


    it('Жанры', () => {
        enableMocks();
        cy.visit('/');

        cy.get('.catalog').as('catalog');
        cy.get('.catalog__genres-item').should('have.length.lessThan', 9 + 1);

        const checkTab = (filmList) => {
            // 8 карточек согласно мокам
            filmList.slice(0, 8).forEach((film) => {
                if (film) {
                    cy.get('@catalog').contains(film.name).should('exist');
                }
            });
            if (filmList[8]) {
                cy.get('@catalog').contains(filmList[8].name).should('not.exist');

                // кнопка ещё согласно мокам
                cy.get('.catalog__button').click();
                filmList.slice(8, 16).forEach((film) => {
                    if (film) {
                        cy.get('@catalog').contains(film.name).should('exist');
                    }
                });
            }

            // кнопка исчезает при открытии всех фильмов
            let clicks = Math.floor(filmList.length / 8) - 1;
            while(clicks > 0) {
                cy.get('.catalog__button').click();
                clicks--;
            }
            cy.get('.catalog__button').should('not.exist');
        };

        // первая вкладка
        cy.get('.catalog__genres-item--active .catalog__genres-link').should('have.text', 'All genres');
        checkTab(films);

        // переключаем на вторую вкладку
        cy.get('.catalog__genres-item:nth-child(2)').click();
        cy.get('.catalog__genres-item:nth-child(2)').should('have.class', 'catalog__genres-item--active');

        cy.get('.catalog__genres-item:nth-child(2) .catalog__genres-link').then(($el) => {
            const genre = $el.text();
            const filteredFilms = films.filter(f => f.genre === genre);
            checkTab(filteredFilms);
        });
    });

    it('Карточки', () => {
        enableMocks();
        cy.visit('/');

        const film = films[0];
        cy.get('.catalog__films-card:first-child').as('card');
        cy.get('@card').find('.small-film-card__image img').should('have.attr', 'src', film.previewImage);

        cy.get('@card').trigger('mouseover');
        cy.wait(500);
        cy.get('@card').find('video').should('have.attr', 'src', film.previewVideoLink);
        cy.get('@card').trigger('mouseleave');
        cy.wait(500);

        cy.get('@card').click();
        cy.url().should('contain', `/films/${film.id}`)
    });

});