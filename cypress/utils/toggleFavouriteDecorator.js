import joinUrl from 'url-join';
import { Path } from "../utils/enableMocks";

export default (promoData, favoriteData) => {
    let counter = 0;
    return () => {
        counter++;
        const isFavorite = counter % 2 === 1 ? !promoData.isFavorite : promoData.isFavorite;
        const updatedFilm = { ...promoData, isFavorite }
        cy.intercept(joinUrl(Cypress.env('apiServer'), Path.PROMO), {
            statusCode: 200,
            body: updatedFilm,
        });
        cy.intercept(joinUrl(Cypress.env('apiServer'), Path.FAVOURITE), (req) => {
            const data = [...favoriteData, updatedFilm];
            const idMap = {};
            const body = data.filter(f => {
                if (idMap[f.id]) {
                    return false;
                }
                idMap[f.id] = f.id;
                return f.isFavorite;
            });
            req.reply({
                statusCode: 200,
                body,
            });
        });
    };
};
