import { Page } from 'puppeteer';
import { pageSetUp } from '../puppeteer';
import {
    emulateClickInCross,
    emulateHover,
    initBlankMap,
    makeScreenshotsPath,
    makeSnapshot,
} from '../puppeteer/utils';
import { MAP_CENTER, PAGE_CENTER } from '../puppeteer/config';

let page: Page;

describe('Interactions with Ruler', () => {
    const dirPath = makeScreenshotsPath('user_interactions');

    beforeEach(async () => {
        page = await pageSetUp();
        await initBlankMap(page, { styleZoom: 6 });
        await page.waitForFunction(() => window.ready);

        await page.evaluate(() => {
            window.ruler = new window.Ruler(window.sdk.map, { mode: 'polyline' });
            window.ruler.on('redraw', () => (window.ready = true));
            window.ruler.on('change', () => (window.rulerChanged = true));
            window.ready = false;
            window.rulerChanged = false;
        });
    });

    afterEach(async () => {
        await page.close();
    });

    it('Add point on click', async () => {
        await page.mouse.click(PAGE_CENTER[0], PAGE_CENTER[1], { button: 'left' });
        await page.waitForFunction(() => window.ready);
        await page.waitForFunction(() => window.rulerChanged);
        await makeSnapshot(page, dirPath, 'add_point_first');

        await page.evaluate(() => {
            window.ready = false;
            window.rulerChanged = false;
        });
        await page.mouse.click(PAGE_CENTER[0], PAGE_CENTER[1] + 50, { button: 'left' });
        await page.mouse.move(0, 0, { steps: 1 });
        await page.waitForFunction(() => window.ready);
        await page.waitForFunction(() => window.rulerChanged);
        await makeSnapshot(page, dirPath, 'add_point_second');

        await page.evaluate(() => {
            window.ready = false;
            window.rulerChanged = false;
        });
        await page.mouse.click(PAGE_CENTER[0] + 20, PAGE_CENTER[1] - 50, { button: 'left' });
        await page.mouse.move(0, 0, { steps: 1 });
        await page.waitForFunction(() => window.ready);
        await page.waitForFunction(() => window.rulerChanged);
        await makeSnapshot(page, dirPath, 'add_point_third');
    });

    it('Remove middle point', async () => {
        await page.evaluate(
            (points) => window.ruler.setPoints(points),
            [[MAP_CENTER[0] - 1, MAP_CENTER[1]], MAP_CENTER, [MAP_CENTER[0], MAP_CENTER[1] - 0.7]],
        );
        await page.waitForFunction(() => window.ready);
        await page.waitForFunction(() => window.rulerChanged);
        await makeSnapshot(page, dirPath, 'remove_point_start');

        await page.evaluate(() => {
            window.ready = false;
            window.rulerChanged = false;
        });
        await emulateClickInCross(page, PAGE_CENTER);
        await page.waitForFunction(() => window.ready);
        await page.waitForFunction(() => window.rulerChanged);
        await makeSnapshot(page, dirPath, 'remove_point_end');
    });

    it('Remove first point', async () => {
        await page.evaluate(
            (points) => window.ruler.setPoints(points),
            [MAP_CENTER, [MAP_CENTER[0] - 1, MAP_CENTER[1]], [MAP_CENTER[0], MAP_CENTER[1] - 0.7]],
        );
        await page.waitForFunction(() => window.ready);
        await page.waitForFunction(() => window.rulerChanged);
        await makeSnapshot(page, dirPath, 'remove_start_point_start');

        await page.evaluate(() => {
            window.ready = false;
            window.rulerChanged = false;
        });
        await emulateClickInCross(page, PAGE_CENTER);
        await page.waitForFunction(() => window.ready);
        await page.waitForFunction(() => window.rulerChanged);
        await makeSnapshot(page, dirPath, 'remove_start_point_end');
    });

    it('Add point on line', async () => {
        await page.evaluate(
            (points) => {
                window.ruler.setPoints(points);
            },
            [
                [MAP_CENTER[0] - 1, MAP_CENTER[1] + 1],
                [MAP_CENTER[0] + 1, MAP_CENTER[1] - 1],
            ],
        );
        await page.waitForFunction(() => window.ready);
        await page.waitForFunction(() => window.rulerChanged);

        await emulateHover(page, PAGE_CENTER);
        await page.waitForTimeout(100);
        await makeSnapshot(page, dirPath, 'add_point_on_line_hover');

        await page.evaluate(() => {
            window.ready = false;
            window.rulerChanged = false;
        });
        await page.mouse.click(PAGE_CENTER[0], PAGE_CENTER[1]);
        await page.mouse.move(0, 0);
        await page.waitForFunction(() => window.ready);
        await page.waitForFunction(() => window.rulerChanged);
        await makeSnapshot(page, dirPath, 'add_point_on_line');
    });

    it('Drag point', async () => {
        await page.evaluate(
            (points) => window.ruler.setPoints(points),
            [[MAP_CENTER[0] - 1, MAP_CENTER[1]], MAP_CENTER, [MAP_CENTER[0], MAP_CENTER[1] - 0.7]],
        );
        await page.waitForFunction(() => window.ready);
        await makeSnapshot(page, dirPath, 'drag_point_init');

        await page.evaluate(() => {
            window.ready = false;
            window.rulerChanged = false;
        });
        await page.mouse.move(PAGE_CENTER[0], PAGE_CENTER[1], { steps: 20 });
        await page.mouse.down({ button: 'left' });
        await page.mouse.move(PAGE_CENTER[0] + 20, PAGE_CENTER[1] - 20, { steps: 20 });
        await page.waitForTimeout(100);
        await makeSnapshot(page, dirPath, 'drag_point_hold_down');

        await page.mouse.up({ button: 'left' });
        await page.mouse.move(0, 0);
        await page.waitForFunction(() => window.ready);
        await page.waitForFunction(() => window.rulerChanged);
        await makeSnapshot(page, dirPath, 'drag_point_end');
    });
});
