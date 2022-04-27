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

describe('RulerControl', () => {
    const dirPath = makeScreenshotsPath('ruler_control');

    beforeEach(async () => {
        page = await pageSetUp();
        await initBlankMap(page, { styleZoom: 6 });
        await waitForReadiness(page);
        await page.evaluate(() => {
            window.control = new window.Control(window.sdk.map, { position: 'topCenter' });
        });
        await handleRulerEvent(page);
    });

    afterEach(async () => await page.close());

    it('Ruler must be enabled on create control', async () => {
        await page.mouse.click(PAGE_CENTER[0], PAGE_CENTER[1], { button: 'left' });
        await waitForReadiness(page);
        await makeSnapshot(page, dirPath, 'enabled_on_creation');
    });

    it('Disable ruler on click button', async () => {
        await page.mouse.click(PAGE_CENTER[0], PAGE_CENTER[1], { button: 'left' });
        await waitForReadiness(page);
        await clickRulerControl(page);
        await handleRulerEvent(page);

        await page.mouse.click(PAGE_CENTER[0] + offset, PAGE_CENTER[1], { button: 'left' });
        await waitForReadiness(page);
        await makeSnapshot(page, dirPath, 'disable_on_click');
    });

    it('Enable ruler on click button', async () => {
        await page.mouse.click(PAGE_CENTER[0], PAGE_CENTER[1], { button: 'left' });
        await waitForReadiness(page);
        await clickRulerControl(page);
        await clickRulerControl(page);
        await handleRulerEvent(page);

        await page.mouse.click(PAGE_CENTER[0] + offset, PAGE_CENTER[1], { button: 'left' });
        await waitForReadiness(page);
        await makeSnapshot(page, dirPath, 'enable_on_click');
    });

    it('Ruler must be reset after destroy control', async () => {
        await page.mouse.click(PAGE_CENTER[0], PAGE_CENTER[1], { button: 'left' });
        await waitForReadiness(page);
        await page.evaluate(() => {
            window.control.destroy();
            window.control = new window.Control(window.sdk.map, { position: 'topCenter' });
        });
        await handleRulerEvent(page);
        await page.mouse.click(PAGE_CENTER[0] + offset, PAGE_CENTER[1], {
            button: 'left',
            delay: 1000,
        });
        await waitForReadiness(page);
        await makeSnapshot(page, dirPath, 'destroy control');
    });
});
