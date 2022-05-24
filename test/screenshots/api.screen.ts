import { Page } from 'puppeteer';
import { pageSetUp } from '../puppeteer';
import {
    emulateHover,
    initBlankMap,
    makeScreenshotsPath,
    makeSnapshot,
    waitForReadiness,
} from '../puppeteer/utils';
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
        await initBlankMap(page);
        await waitForReadiness(page);
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
                    labelVisibilitySettings: {
                        area: true,
                        snapPoint: true,
                        perimeter: true,
                    },
                });
                window.ready = false;
            }, points);
            await waitForReadiness(page);
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
            await waitForReadiness(page);
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
        it('create with hidden perimeter labels', async () => {
            await page.evaluate((points) => {
                window.ruler = new window.Ruler(window.sdk.map, {
                    mode: 'polyline',
                    points,
                    labelVisibilitySettings: {
                        perimeter: false,
                    },
                });
            }, points);
            await makeSnapshot(page, dirPath, 'create_ruler_with_hidden_perimeter_labels');
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

            await waitForReadiness(page);
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
                window.ready = false;
                window.ruler.setPoints(points);
                window.ruler.enable();
            }, points);
            await waitForReadiness(page);
            await makeSnapshot(page, dirPath, 'enable_after_set_points');
        });
        it('enable after set points via `constructor`', async () => {
            await page.evaluate((points) => {
                window.ruler = new window.Ruler(window.sdk.map, {
                    mode: 'polyline',
                    enabled: false,
                    points,
                });
                window.ready = false;
                window.ruler.enable();
            }, points);
            await waitForReadiness(page);
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
                window.ready = false;
                window.ruler.disable();
                window.ruler.enable();
            }, points);

            await waitForReadiness(page);
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
            await waitForReadiness(page);
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
            await waitForReadiness(page);
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
                    labelVisibilitySettings: {
                        area: true,
                        snapPoint: true,
                        perimeter: true,
                    },
                });
                window.ready = false;
            }, points);
            await waitForReadiness(page);
            await makeSnapshot(page, dirPath, 'create_ruler_polygon_with_params');
        });

        it('create polygon with hidden area labels', async () => {
            await page.evaluate((points) => {
                window.ruler = new window.Ruler(window.sdk.map, {
                    mode: 'polygon',
                    points,
                    labelVisibilitySettings: {
                        area: false,
                    },
                });
                window.ready = false;
            }, points);
            await waitForReadiness(page);
            await makeSnapshot(page, dirPath, 'create_ruler_polygon_with_hidden_area_labels');
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
            await waitForReadiness(page);
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
            await waitForReadiness(page);
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
            await waitForReadiness(page);
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
        describe('polyline', () => {
            it('when empty', async () => {
                await page.evaluate(() => {
                    window.ruler = new window.Ruler(window.sdk.map, { mode: 'polyline' });
                });
                const data = await page.evaluate(() => {
                    return window.ruler.getData();
                });
                expect(data).toEqual({
                    type: 'polyline',
                    coordinates: [],
                    length: 0,
                    lengths: [],
                });
            });
            it('when disabled', async () => {
                await page.evaluate(() => {
                    window.ruler = new window.Ruler(window.sdk.map, { mode: 'polyline' });
                    window.ruler.disable();
                });
                const data = await page.evaluate(() => {
                    return window.ruler.getData();
                });
                expect(data).toEqual({
                    type: 'polyline',
                    coordinates: [],
                    length: 0,
                    lengths: [],
                });
            });
            it('when destroyed', async () => {
                await page.evaluate(() => {
                    window.ruler = new window.Ruler(window.sdk.map, { mode: 'polyline' });
                    window.ruler.destroy();
                });
                const data = await page.evaluate(() => {
                    return window.ruler.getData();
                });
                expect(data).toEqual({
                    type: 'polyline',
                    coordinates: [],
                    length: 0,
                    lengths: [],
                });
            });
            it('with points', async () => {
                await page.evaluate((points) => {
                    window.ruler = new window.Ruler(window.sdk.map, {
                        mode: 'polyline',
                        points,
                    });
                    window.ready = false;
                }, points);
                await waitForReadiness(page);
                const data = await page.evaluate(() => {
                    return window.ruler.getData();
                });
                expect(data.type).toBe('polyline');
                expect(data.coordinates).toEqual(points);
            });
        });

        describe('polygon', function () {
            it('when empty', async () => {
                await page.evaluate(() => {
                    window.ruler = new window.Ruler(window.sdk.map, { mode: 'polygon' });
                });
                const data = await page.evaluate(() => {
                    return window.ruler.getData();
                });
                expect(data).toEqual({
                    type: 'polygon',
                    coordinates: [[]],
                    perimeter: 0,
                    area: 0,
                    lengths: [],
                });
            });
            it('when disabled', async () => {
                await page.evaluate(() => {
                    window.ruler = new window.Ruler(window.sdk.map, { mode: 'polygon' });
                    window.ruler.disable();
                });
                const data = await page.evaluate(() => {
                    return window.ruler.getData();
                });
                expect(data).toEqual({
                    type: 'polygon',
                    coordinates: [[]],
                    perimeter: 0,
                    area: 0,
                    lengths: [],
                });
            });
            it('when destroyed', async () => {
                await page.evaluate(() => {
                    window.ruler = new window.Ruler(window.sdk.map, { mode: 'polygon' });
                    window.ruler.destroy();
                });
                const data = await page.evaluate(() => {
                    return window.ruler.getData();
                });
                expect(data).toEqual({
                    type: 'polygon',
                    coordinates: [[]],
                    perimeter: 0,
                    area: 0,
                    lengths: [],
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
                await waitForReadiness(page);

                const data = await page.evaluate(() => {
                    return window.ruler.getData();
                });
                expect(data.type).toBe('polygon');
                expect(data.coordinates).toEqual([points]);
            });

            it('get polygon with points data without labels', async () => {
                await page.evaluate((points) => {
                    window.ruler = new window.Ruler(window.sdk.map, {
                        mode: 'polygon',
                        points,
                        labelVisibilitySettings: {
                            area: false,
                            snapPoint: false,
                            perimeter: false,
                        },
                    });
                    window.ready = false;
                }, points);

                const data = await page.evaluate(() => {
                    return window.ruler.getData();
                });
                expect(data.type).toBe('polygon');
                expect(data.coordinates).toEqual([points]);
            });
        });
    });

    it('#setLabelsVisibility', async () => {
        await page.evaluate((points) => {
            window.ruler = new window.Ruler(window.sdk.map, {
                mode: 'polygon',
                points,
            });
            window.ruler.on('redraw', () => (window.ready = true));
            window.ready = false;
            window.ruler.setLabelsVisibility({
                area: false,
                perimeter: false,
                snapPoint: false,
            });
        }, points);
        await waitForReadiness(page);
        await makeSnapshot(page, dirPath, 'hide_labels');

        await page.evaluate(() => {
            window.ready = false;
            window.ruler.setLabelsVisibility({ area: true, perimeter: true, snapPoint: true });
        });
        await waitForReadiness(page);
        await makeSnapshot(page, dirPath, 'show_labels');
    });
});
