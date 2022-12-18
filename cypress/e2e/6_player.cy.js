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
        cy.contains(film.name)
        cy.get('.btn--play').click();
        cy.url().should('contain', Path.PLAYER);
        cy.get('.player__name').should('contain', film.name);
    });

    it('Закрытие плеера', () => {
        cy.visit(Path.FILM);
        cy.visit(Path.PLAYER);
        cy.get('.player__exit').click();
        cy.url().should('contain', Path.FILM);
    });

    it('Проигрывание', () => {
        // автопроигрывание - условие для этого muted
        cy.get('video')
            .should('have.prop', 'muted');
        cy.get('video')
         .should('have.prop', 'paused', false);

        //  нажатие на кнопку меняет состояние плеера play/pause
        cy.get('.player__video').then(([$video]) => {
            cy.get('.player__play').click().then(() => {
                expect($video.paused).to.be.true;
            });

            cy.get('.player__play').click().then(() => {
                expect($video.paused).to.be.false;
            });
        });

        // при проигрывании меняется положение progressbar
        // меняется время в формате '-HH:mm:ss' или '-mm:ss'
        cy.get('.player__video').then(([$video]) => {
            cy.get('.player__play').click();
            $video.pause();

            const duration = Math.floor($video.duration - $video.currentTime);
            const format = $video.duration > 3600 ? '-HH:mm:ss' : '-mm:ss';
            const beginTime = dayjs(0).utcOffset(0).second(duration);

            // play
            cy.get('.player__time-value').should('contain', beginTime.format(format));
            cy.get('progress').then(([$el]) => {
                expect($el.value).to.be.equal($video.currentTime/$video.duration*100);
            });
            cy.get('.player__play').click();
            cy.wait(1000);

            // pause
            cy.get('.player__play').click();
            cy.get('.player__time-value').then($el => {
                const endTime = dayjs($el.text(), format, true);
                const diff = beginTime.subtract(endTime).second();
                expect(diff).to.be.equal(1);
            });
            cy.get('progress').then(([$el]) => {
                expect($el.value).to.be.equal($video.currentTime/$video.duration*100);
            });
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