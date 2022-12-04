import dayjs from 'dayjs';
import { enableMocks, Path } from '../utils/enableMocks';
import film from '../fixtures/film.json';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import utc from 'dayjs/plugin/utc';

dayjs.extend(customParseFormat)
dayjs.extend(utc)

describe('Просмотр фильмов', () => {
    beforeEach(() => {
        enableMocks();
        cy.visit(Path.PLAYER);
    });

    it('Переход на страницу плеера', () => {
        cy.visit(Path.FILM);
        cy.get('.btn--play').click();
        cy.url().should('contain', Path.PLAYER);
        cy.get('.player__name').should('contain', film.name);
    });

    it('Закрытие плеера', () => {
        cy.get('.player__exit').click();
        cy.url().should('contain', Path.FILM);
    });

    it('Проигрывание', () => {
        cy.wait(2000);
        cy.get('.player__video').then(([$el]) => {
            const duration = Math.floor($el.duration);
            const format = duration > 3600 ? '-HH:mm:ss' : '-mm:ss';
            const beginTime = dayjs(0).utcOffset(0).second(duration);

            // play
            cy.get('.player__time-value').should('contain', beginTime.format(format));
            cy.get('.player__play').click();

            cy.wait(1000);

            // pause
            cy.get('.player__play').click();
            cy.get('.player__time-value').then($el => {
                const endTime = dayjs($el.text(), format, true);
                const diff = beginTime.subtract(endTime).second();
                expect(diff).to.be.equal(1);
            })
        });
    });

    it('Фулскрин', () => {
        cy.on('uncaught:exception', (err, runnable) => {
            expect(err.message).to.match(/fullscreen/);
            return false;
        });
        cy.get('.player__full-screen').click();
    });
});