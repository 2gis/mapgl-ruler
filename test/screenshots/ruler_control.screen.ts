import { Page } from 'puppeteer';
import {
    initBlankMap,
    makeScreenshotsPath,
    makeSnapshot,
    waitForReadiness,
} from '../puppeteer/utils';
import { pageSetUp } from '../puppeteer';
import { PAGE_CENTER } from '../puppeteer/config';

let page: Page;

const handleRulerEvent = async (page: Page) => {
    await page.evaluate(() => {
        window.control.getRuler().on('redraw', () => (window.ready = true));
        window.ready = false;
    });
};

const clickRulerControl = async (page: Page) => {
    await page.click('.src-control-index-module__button', { delay: 1000 });
};

const offset = 30;
const dirPath = makeScreenshotsPath('ruler_control');

describe('RulerControl (polyline mode)', () => {
    beforeEach(async () => {
        page = await pageSetUp();
        await initBlankMap(page, { styleZoom: 6 });
        await waitForReadiness(page);
        await page.evaluate(() => {
            window.control = new window.Control(
                window.sdk.map,
                { position: 'topCenter' },
                { mode: 'polyline' },
            );
        });
        await handleRulerEvent(page);
    });

    afterEach(async () => await page.close());

    it('(polyline) Ruler must be enabled on create control', async () => {
        await page.mouse.click(PAGE_CENTER[0], PAGE_CENTER[1], { button: 'left' });
        await waitForReadiness(page);
        await makeSnapshot(page, dirPath, 'polyline_enabled_on_creation');
    });

    it('(polyline) Disable ruler on click button', async () => {
        await page.mouse.click(PAGE_CENTER[0], PAGE_CENTER[1], { button: 'left' });
        await waitForReadiness(page);
        await clickRulerControl(page);
        await handleRulerEvent(page);

        await page.mouse.click(PAGE_CENTER[0] + offset, PAGE_CENTER[1], { button: 'left' });
        await waitForReadiness(page);
        await makeSnapshot(page, dirPath, 'polyline_disable_on_click');
    });

    it('(polyline) Enable ruler on click button', async () => {
        await page.mouse.click(PAGE_CENTER[0], PAGE_CENTER[1], { button: 'left' });
        await waitForReadiness(page);
        await clickRulerControl(page);
        await clickRulerControl(page);
        await handleRulerEvent(page);

        await page.mouse.click(PAGE_CENTER[0] + offset, PAGE_CENTER[1], { button: 'left' });
        await waitForReadiness(page);
        await makeSnapshot(page, dirPath, 'polyline_enable_on_click');
    });

    it('(polyline) Ruler must be reset after destroy control', async () => {
        await page.mouse.click(PAGE_CENTER[0], PAGE_CENTER[1], { button: 'left' });
        await waitForReadiness(page);
        await page.evaluate(() => {
            window.control.destroy();
            window.control = new window.Control(
                window.sdk.map,
                { position: 'topCenter' },
                { mode: 'polyline' },
            );
        });
        await handleRulerEvent(page);
        await page.mouse.click(PAGE_CENTER[0] + offset, PAGE_CENTER[1], {
            button: 'left',
            delay: 1000,
        });
        await waitForReadiness(page);
        await makeSnapshot(page, dirPath, 'polyline_destroy_control');
    });
});

describe('RulerControl (polygon mode)', () => {
    beforeEach(async () => {
        page = await pageSetUp();
        await initBlankMap(page, { styleZoom: 6 });
        await waitForReadiness(page);
        await page.evaluate(() => {
            window.control = new window.Control(
                window.sdk.map,
                { position: 'topCenter' },
                { mode: 'polygon' },
            );
        });
        await handleRulerEvent(page);
    });

    afterEach(async () => await page.close());

    it('(polygon) Ruler must be enabled on create control', async () => {
        await page.mouse.click(PAGE_CENTER[0], PAGE_CENTER[1], { button: 'left' });
        await waitForReadiness(page);
        await makeSnapshot(page, dirPath, 'polygon_enabled_on_creation');
    });

    it('(polygon) Disable ruler on click button', async () => {
        await page.mouse.click(PAGE_CENTER[0], PAGE_CENTER[1], { button: 'left' });
        await waitForReadiness(page);
        await clickRulerControl(page);
        await handleRulerEvent(page);

        await page.mouse.click(PAGE_CENTER[0] + offset, PAGE_CENTER[1], { button: 'left' });
        await waitForReadiness(page);
        await makeSnapshot(page, dirPath, 'polygon_disable_on_click');
    });

    it('(polygon) Enable ruler on click button', async () => {
        await page.mouse.click(PAGE_CENTER[0], PAGE_CENTER[1], { button: 'left' });
        await waitForReadiness(page);
        await clickRulerControl(page);
        await clickRulerControl(page);
        await handleRulerEvent(page);

        await page.mouse.click(PAGE_CENTER[0] + offset, PAGE_CENTER[1], { button: 'left' });
        await waitForReadiness(page);
        await makeSnapshot(page, dirPath, 'polygon_enable_on_click');
    });

    it('(polygon) Ruler must be reset after destroy control', async () => {
        await page.mouse.click(PAGE_CENTER[0], PAGE_CENTER[1], { button: 'left' });
        await waitForReadiness(page);
        await page.evaluate(() => {
            window.control.destroy();
            window.control = new window.Control(
                window.sdk.map,
                { position: 'topCenter' },
                { mode: 'polygon' },
            );
        });
        await handleRulerEvent(page);
        await page.mouse.click(PAGE_CENTER[0] + offset, PAGE_CENTER[1], {
            button: 'left',
            delay: 1000,
        });
        await waitForReadiness(page);
        await makeSnapshot(page, dirPath, 'polygon_destroy_control');
    });
});
