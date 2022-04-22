import { Page } from 'puppeteer';
import { pageSetUp } from '../puppeteer';
import { initBlankMap, makeScreenshotsPath, makeSnapshot } from '../puppeteer/utils';
import { MAP_CENTER } from '../puppeteer/config';

let page: Page;

describe('Ruler API. Polygon', () => {
    const dirPath = makeScreenshotsPath('api');
    const points = [
        [MAP_CENTER[0] - 1, MAP_CENTER[1] - 0.7],
        [MAP_CENTER[0], MAP_CENTER[1] + 0.5],
        [MAP_CENTER[0] + 1, MAP_CENTER[1] - 0.7],
    ];

    beforeEach(async () => {
        page = await pageSetUp();
        await page.evaluate(() => (window.ready = false));
        await initBlankMap(page);
        await page.waitForFunction(() => window.ready);
    });

    afterEach(async () => {
        await page.close();
    });

    it('create polygon with defaults', async () => {
        await page.evaluate(() => {
            window.ruler = new window.Ruler(window.sdk.map, { mode: 'polygon' });
        });
        await makeSnapshot(page, dirPath, 'create_ruler_polygon_with_defaults');
    });
    it('create polygon with all parameters', async () => {
        await page.evaluate((points) => {
            window.ruler = new window.Ruler(window.sdk.map, {
                mode: 'polygon',
                enabled: true,
                points,
            });
            window.ready = false;
        }, points);
        await page.waitForFunction(() => window.ready);
        await makeSnapshot(page, dirPath, 'create_ruler_polygon_with_params');
    });

    it('change language EN to RU for polygon', async () => {
        await page.evaluate((points) => {
            window.sdk.map.setLanguage('ru');
            window.ruler = new window.Ruler(window.sdk.map, {
                mode: 'polygon',
                points,
            });
            window.ready = false;
        }, points);
        await page.waitForFunction(() => window.ready);
        await makeSnapshot(page, dirPath, 'polygon_change_language_en_to_ru');
    });

    it('setPoints for polygon', async () => {
        await page.evaluate((points) => {
            window.ruler = new window.Ruler(window.sdk.map, {
                mode: 'polygon',
            });
            window.ready = false;
            window.ruler.on('redraw', () => (window.ready = true));
            window.ruler.setPoints(points);
        }, points);
        await page.waitForFunction(() => window.ready);
        await makeSnapshot(page, dirPath, 'polygon_set_points');
    });
    it('enable polygon', async () => {
        await page.evaluate((points) => {
            window.ruler = new window.Ruler(window.sdk.map, {
                mode: 'polygon',
                enabled: false,
                points,
            });
            window.ready = false;
            window.ruler.enable();
        }, points);
        await page.waitForFunction(() => window.ready);
        await makeSnapshot(page, dirPath, 'polygon_enable');
    });
    it('disable polygon', async () => {
        await page.evaluate((points) => {
            window.ruler = new window.Ruler(window.sdk.map, {
                mode: 'polygon',
                points,
            });
            window.ruler.disable();
        });
        await makeSnapshot(page, dirPath, 'polygon_disable');
    });

    it('destroy polygon', async () => {
        await page.evaluate((points) => {
            window.ruler = new window.Ruler(window.sdk.map, {
                mode: 'polygon',
                points,
            });
            window.ruler.destroy();
        });
        await makeSnapshot(page, dirPath, 'polygon_destroy');
    });
});
