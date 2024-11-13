import { Page } from 'puppeteer';
import { initBlankMap, waitForReadiness, emulateClickInCross } from '../puppeteer/utils';
import { pageSetUp } from '../puppeteer';
import { MAP_CENTER, PAGE_CENTER } from '../puppeteer/config';

let page: Page;

describe('ChangeEvent', () => {
    beforeEach(async () => {
        page = await pageSetUp();
        await initBlankMap(page, { styleZoom: 6 });
        await page.evaluate(() => {
            window.ruler = new window.Ruler(window.sdk.map, {
                mode: 'polyline',
            });
            window.ready = false;
        });
        await waitForReadiness(page);
        await page.evaluate(() => (window.spy = window.sinon.spy()));
    });

    afterEach(async () => await page.close());

    describe('API actions', () => {
        const points = [
            [MAP_CENTER[0] - 1, MAP_CENTER[1] - 0.7],
            [MAP_CENTER[0], MAP_CENTER[1] + 0.5],
            [MAP_CENTER[0] + 1, MAP_CENTER[1] - 0.7],
        ];
        const expectedData = {
            coordinates: points,
            length: 295874,
            lengths: [0, 147937, 295874],
            type: 'polyline',
        };

        it('Event is called on setting points', async () => {
            await page.evaluate((points) => {
                window.ruler.on('change', window.spy);
                window.ruler.setPoints(points);
            }, points);

            expect(await page.evaluate(() => window.spy.calledOnce)).toBeTruthy();
            expect(await page.evaluate(() => window.spy.lastCall.args[0].isUser)).toBeFalsy();
            expect(await page.evaluate(() => window.spy.lastCall.args[0].data)).toEqual(
                expectedData,
            );
        });

        it('Event is not called on switching language', async () => {
            await page.evaluate((points) => {
                window.ruler.setPoints(points);
                window.ruler.on('change', window.spy);
                window.sdk.map.setLanguage('ru');
            }, points);
            expect(await page.evaluate(() => window.spy.notCalled)).toBeTruthy();
        });

        it('Event is not called on disabling ruler', async () => {
            await page.evaluate((points) => {
                window.ruler.setPoints(points);
                window.ruler.on('change', window.spy);
                window.ruler.disable();
            }, points);
            expect(await page.evaluate(() => window.spy.notCalled)).toBeTruthy();
        });

        it('Event is not called on destroying ruler', async () => {
            await page.evaluate((points) => {
                window.ruler.setPoints(points);
                window.ruler.on('change', window.spy);
                window.ruler.destroy();
            }, points);
            expect(await page.evaluate(() => window.spy.notCalled)).toBeTruthy();
        });
    });

    describe('User actions', () => {
        it('Event is called on setting point', async () => {
            await page.evaluate(() => {
                window.ruler.on('change', window.spy);
            });
            await page.mouse.click(PAGE_CENTER[0], PAGE_CENTER[1], { button: 'left' });
            await page.waitForFunction(() => window.spy.called);

            expect(await page.evaluate(() => window.spy.calledOnce)).toBeTruthy();
            expect(await page.evaluate(() => window.spy.lastCall.args[0].isUser)).toBeTruthy();
            expect(await page.evaluate(() => window.spy.lastCall.args[0].data)).toEqual({
                coordinates: [[82.920412, 55.03011100006447]],
                length: 0,
                lengths: [0],
                type: 'polyline',
            });
        });

        it('Event is called on dragging point', async () => {
            await page.mouse.click(PAGE_CENTER[0], PAGE_CENTER[1], { button: 'left' });
            await page.evaluate(() => {
                window.ruler.on('change', window.spy);
            });

            await page.mouse.move(PAGE_CENTER[0], PAGE_CENTER[1], { steps: 20 });
            await page.mouse.down({ button: 'left' });
            await page.mouse.move(PAGE_CENTER[0] + 20, PAGE_CENTER[1] - 20, { steps: 20 });
            await page.mouse.up({ button: 'left' });

            expect(await page.evaluate(() => window.spy.calledTwice)).toBeTruthy();
            expect(await page.evaluate(() => window.spy.lastCall.args[0].isUser)).toBeTruthy();
            expect(await page.evaluate(() => window.spy.lastCall.args[0].data)).toEqual({
                coordinates: [[83.35986512572973, 55.281191071297776]],
                length: 0,
                lengths: [0],
                type: 'polyline',
            });
        });

        // broken? cannot wait to delete all the data
        it.skip('Event is called on removing point', async () => {
            await page.mouse.click(PAGE_CENTER[0], PAGE_CENTER[1], { button: 'left' });
            await page.evaluate(() => {
                window.ruler.on('change', window.spy);
            });
            await page.waitForTimeout(100);
            await emulateClickInCross(page, PAGE_CENTER);

            expect(await page.evaluate(() => window.spy.calledOnce)).toBeTruthy();
            expect(await page.evaluate(() => window.spy.lastCall.args[0].isUser)).toBeTruthy();
            expect(await page.evaluate(() => window.spy.lastCall.args[0].data)).toEqual({
                coordinates: [[82.920412, 55.03011100006447]],
                length: 0,
                lengths: [0],
                type: 'polyline',
            });
        });

        it('Event is called on removing middle point', async () => {
            const points = [
                [MAP_CENTER[0] - 1, MAP_CENTER[1]],
                MAP_CENTER,
                [MAP_CENTER[0], MAP_CENTER[1] - 0.7],
            ];
            await page.evaluate((points) => {
                window.ruler.setPoints(points);
                window.ruler.on('change', window.spy);
            }, points);
            await page.waitForTimeout(100);
            await emulateClickInCross(page, PAGE_CENTER);

            expect(await page.evaluate(() => window.spy.calledOnce)).toBeTruthy();
            expect(await page.evaluate(() => window.spy.lastCall.args[0].isUser)).toBeTruthy();
            expect(await page.evaluate(() => window.spy.lastCall.args[0].data)).toEqual({
                coordinates: [points[0], points[2]],
                length: 141566,
                lengths: [0, 141566],
                type: 'polyline',
            });
        });
    });
});
