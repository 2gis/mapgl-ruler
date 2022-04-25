import { Page } from 'puppeteer';
import { pageSetUp } from '../puppeteer';
import { emulateHover, initBlankMap, makeScreenshotsPath, makeSnapshot } from '../puppeteer/utils';
import { MAP_CENTER, PAGE_CENTER } from '../puppeteer/config';

let page: Page;

describe('Ruler API', () => {
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

    describe('polyline mode', () => {
        it('create with all parameters', async () => {
            await page.evaluate((points) => {
                window.ruler = new window.Ruler(window.sdk.map, {
                    mode: 'polyline',
                    enabled: true,
                    points,
                });
            }, points);
            await makeSnapshot(page, dirPath, 'create_ruler_with_params');
        });
        it('create with defaults', async () => {
            await page.evaluate(() => {
                window.ruler = new window.Ruler(window.sdk.map, { mode: 'polyline' });
            });

            await makeSnapshot(page, dirPath, 'create_ruler_with_defaults');
        });
        it('create with points', async () => {
            await page.evaluate((points) => {
                window.ruler = new window.Ruler(window.sdk.map, {
                    mode: 'polyline',
                    points,
                });
                window.ready = false;
            }, points);
            await page.waitForFunction(() => window.ready);
            await makeSnapshot(page, dirPath, 'create_ruler_with_points');
        });
        it('create disabled', async () => {
            await page.evaluate((points) => {
                window.ruler = new window.Ruler(window.sdk.map, {
                    mode: 'polyline',
                    enabled: false,
                    points,
                });
            }, points);

            await makeSnapshot(page, dirPath, 'create_ruler_disabled');
        });

        it('setPoints(...) when enabled', async () => {
            await page.evaluate((points) => {
                window.ruler = new window.Ruler(window.sdk.map, {
                    mode: 'polyline',
                    enabled: true,
                });
                window.ready = false;
                window.ruler.on('redraw', () => (window.ready = true));
                window.ruler.setPoints(points);
            }, points);

            await page.waitForFunction(() => window.ready);
            await makeSnapshot(page, dirPath, 'set_points_when_enabled_by_option');
        });
        it('setPoints(...) when disabled', async () => {
            await page.evaluate((points) => {
                window.ruler = new window.Ruler(window.sdk.map, {
                    mode: 'polyline',
                    enabled: false,
                });
                window.ruler.setPoints(points);
            }, points);

            await makeSnapshot(page, dirPath, 'set_points_when_disabled_by_option');
        });
        it('enable after setPoints', async () => {
            await page.evaluate((points) => {
                window.ruler = new window.Ruler(window.sdk.map, {
                    mode: 'polyline',
                    enabled: false,
                });
                window.ruler.setPoints(points);
                window.ruler.enable();
                window.ready = false;
            }, points);
            await page.waitForFunction(() => window.ready);
            await makeSnapshot(page, dirPath, 'enable_after_set_points');
        });
        it('enable after set points via `constructor`', async () => {
            await page.evaluate((points) => {
                window.ruler = new window.Ruler(window.sdk.map, {
                    mode: 'polyline',
                    enabled: false,
                    points,
                });
                window.ruler.enable();
                window.ready = false;
            }, points);
            await page.waitForFunction(() => window.ready);
            await makeSnapshot(page, dirPath, 'enable_after_set_points_via_constructor');
        });
        it('setPoints(...) after disabled via method', async () => {
            await page.evaluate((points) => {
                window.ruler = new window.Ruler(window.sdk.map, { mode: 'polyline' });
                window.ruler.disable();
                window.ruler.setPoints(points);
            }, points);

            await makeSnapshot(page, dirPath, 'set_points_after_disable_call');
        });
        it('setPoints(...) after destroyed', async () => {
            await page.evaluate((points) => {
                window.ruler = new window.Ruler(window.sdk.map, { mode: 'polyline' });
                window.ruler.destroy();
                window.ruler.setPoints(points);
            }, points);

            await makeSnapshot(page, dirPath, 'set_points_after_destroyed');
        });
        it('destroy ruler', async () => {
            await page.evaluate((points) => {
                window.ruler = new window.Ruler(window.sdk.map, {
                    mode: 'polyline',
                    enabled: true,
                    points,
                });
                window.ruler.destroy();
            }, points);

            await makeSnapshot(page, dirPath, 'destroy_ruler');
        });
        it('enable ruler after destroy', async () => {
            await page.evaluate((points) => {
                window.ruler = new window.Ruler(window.sdk.map, {
                    mode: 'polyline',
                    enabled: true,
                    points,
                });
                window.ruler.destroy();
                window.ruler.enable();
            }, points);

            await makeSnapshot(page, dirPath, 'enable_after_destroy');
        });
        it('enable ruler after disable', async () => {
            await page.evaluate((points) => {
                window.ruler = new window.Ruler(window.sdk.map, {
                    mode: 'polyline',
                    enabled: true,
                    points,
                });
                window.ruler.disable();
                window.ruler.enable();
            }, points);

            await page.waitForTimeout(100);
            await makeSnapshot(page, dirPath, 'enable_after_disable');
        });

        it('change language EN to RU', async () => {
            await page.evaluate(
                (points) => {
                    window.ruler = new window.Ruler(window.sdk.map, {
                        mode: 'polyline',
                        points,
                    });
                },
                [
                    [MAP_CENTER[0], MAP_CENTER[1] - 0.8],
                    [MAP_CENTER[0], MAP_CENTER[1] + 0.8],
                ],
            );
            await emulateHover(page, PAGE_CENTER);

            await page.evaluate(() => {
                window.ready = false;
                window.sdk.map.setLanguage('ru');
            });
            await page.waitForFunction(() => window.ready);
            await makeSnapshot(page, dirPath, 'change_language_en_to_ru');
        });

        it('change language RU to UNKNOWN', async () => {
            await page.evaluate(
                (points) => {
                    window.sdk.map.setLanguage('ru');
                    window.ruler = new window.Ruler(window.sdk.map, {
                        mode: 'polyline',
                        points,
                    });
                },
                [
                    [MAP_CENTER[0], MAP_CENTER[1] - 0.8],
                    [MAP_CENTER[0], MAP_CENTER[1] + 0.8],
                ],
            );
            await emulateHover(page, PAGE_CENTER);

            await page.evaluate(() => {
                window.ready = false;
                window.sdk.map.setLanguage('KK');
            });
            await page.waitForFunction(() => window.ready);
            await makeSnapshot(page, dirPath, 'change_language_ru_to_unknown');
        });
    });

    describe('polygon mode', () => {
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
            }, points);
            await makeSnapshot(page, dirPath, 'polygon_disable');
        });

        it('destroy polygon', async () => {
            await page.evaluate((points) => {
                window.ruler = new window.Ruler(window.sdk.map, {
                    mode: 'polygon',
                    points,
                });
                window.ruler.destroy();
            }, points);
            await makeSnapshot(page, dirPath, 'polygon_destroy');
        });
    });

    describe('#getData', () => {
        it('get empty polygon data', async () => {
            await page.evaluate(() => {
                window.ruler = new window.Ruler(window.sdk.map, {
                    mode: 'polygon',
                });
            });

            const data = await page.evaluate(() => {
                return window.ruler.getData();
            });
            expect(data).toEqual({
                type: 'polygon',
                coordinates: [[]],
                area: 0,
                perimeter: 0,
                lengths: [0],
            });
        });
        it('get polygon with points data', async () => {
            await page.evaluate((points) => {
                window.ruler = new window.Ruler(window.sdk.map, {
                    mode: 'polygon',
                    points,
                });
                window.ready = false;
            }, points);
            await page.waitForFunction(() => window.ready);

            const data = await page.evaluate(() => {
                return window.ruler.getData();
            });
            expect(data.type).toBe('polygon');
            expect(data.coordinates).toEqual([points]);
        });

        // ?? bug, trowing an error for line with no distance
        it.skip('get empty polyline data', async () => {
            await page.evaluate(() => {
                window.ruler = new window.Ruler(window.sdk.map, { mode: 'polyline' });
            });

            const data = await page.evaluate(() => {
                return window.ruler.getData();
            });
            expect(data).toEqual({
                type: 'polyline',
                coordinates: [],
                area: 0,
                perimeter: 0,
                lengths: [0],
            });
        });
        it('get polyline with points data', async () => {
            await page.evaluate((points) => {
                window.ruler = new window.Ruler(window.sdk.map, {
                    mode: 'polyline',
                    points,
                });
                window.ready = false;
            }, points);
            await page.waitForFunction(() => window.ready);
            const data = await page.evaluate(() => {
                return window.ruler.getData();
            });
            expect(data.type).toBe('polyline');
            expect(data.coordinates).toEqual(points);
        });
    });
});
