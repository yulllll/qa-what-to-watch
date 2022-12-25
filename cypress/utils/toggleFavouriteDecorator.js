import joinUrl from 'url-join';
import { Path } from "../utils/enableMocks";
import filmData from '../fixtures/film.json';
import favoriteData from '../fixtures/favorite.json';
import films from '../fixtures/films.json';

export default (filmPath) => {
    let counter = 0;
    return () => {
        counter++;
        const isFavorite = counter % 2 === 1 ? !filmData.isFavorite : filmData.isFavorite;
        const updatedFilm = { ...filmData, isFavorite }

        // подмена в запросе фильма
        cy.intercept(joinUrl(Cypress.env('apiServer'), filmPath), {
            statusCode: 200,
            body: updatedFilm,
        });

        // подмена в любимых фильмах
        const idMap = {};
        const favouriteBody = [...favoriteData, updatedFilm].filter(f => {
            if (idMap[f.id]) {
                return false;
            }
            idMap[f.id] = f.id;
            return f.isFavorite;
        });

        cy.intercept(joinUrl(Cypress.env('apiServer'), Path.FAVOURITE), { statusCode: 200, body: favouriteBody });

        // подмена во всех фильмах
        cy.intercept(joinUrl(Cypress.env('apiServer'), Path.FILMS), { statusCode: 200, body: films.map(f => f.id === filmData.id ? updatedFilm : f) });

    };
};
