import { API_KEY, MAP_CENTER, MAP_ZOOM, PAGE_CENTER } from './config';
import { Page as PuppeteerPage } from 'puppeteer';
import { MatchImageSnapshotOptions } from 'jest-image-snapshot';

const { configureToMatchImageSnapshot } = require('jest-image-snapshot');

export const defaultFontsPath = 'https://mapgl.2gis.com/api/fonts';
export const defaultIconsPath = 'https://disk.2gis.com/styles/{id}';

const toMatchImageSnapshot = configureToMatchImageSnapshot();
expect.extend({ toMatchImageSnapshot });
declare global {
    namespace jest {
        interface Matchers<R> {
            toMatchImageSnapshot(): R;
        }
    }
}

declare global {
    interface Window {
        ready: boolean;
        mapIdle: () => boolean;
    }
}

// тип any, так как возможность задавать стиль напрямую не публичная
export const blankStyle: any = {
    version: 0,
    name: 'empty',
    background: {
        color: '#f5f2e0',
    },
    layers: [],
};

export function makeScreenshotsPath(relativePath: string) {
    return `test/screenshots/standards/${relativePath}`;
}

export async function initMapWithOptions(page: PuppeteerPage, options?: Partial<mapgl.MapOptions>) {
    await page.evaluate((opts) => {
        window.sdk.map = new window.sdk.Map('map', opts ?? {});
        window.sdk.map.on('idle', () => (window.ready = true));
        window.ready = false;
    }, options as any);
}

/**
 * Инициализирует с пустым стилем (прозрачный фон) и без контролов
 */
export function initBlankMap(page: PuppeteerPage, options?: mapgl.MapOptions) {
    return initMapWithOptions(page, {
        style: blankStyle,
        styleOptions: {
            fontsPath: defaultFontsPath,
            iconsPath: defaultIconsPath,
        },
        // @ts-ignore опция не публичная
        copyright: false,
        zoomControl: false,
        key: API_KEY,
        styleZoom: MAP_ZOOM,
        center: MAP_CENTER,
        ...options,
    });
}

export function options(name, dirPath?) {
    const options: MatchImageSnapshotOptions = {
        customSnapshotsDir: dirPath,
        customSnapshotIdentifier: name,
    };
    return options;
}

export async function makeSnapshot(
    page: PuppeteerPage,
    dirPath: string,
    name: string,
    matchOptions?: MatchImageSnapshotOptions,
) {
    const image: string | Buffer = await page.screenshot({ encoding: 'binary' });
    expect(image).toMatchImageSnapshot({
        customSnapshotsDir: dirPath,
        customSnapshotIdentifier: name,
        failureThresholdType: 'pixel',
        failureThreshold: 4,
        ...(matchOptions || {}),
    });
}

export async function emulateClickInCross(page: PuppeteerPage, point: number[]) {
    await page.mouse.move(point[0], point[1]);
    await page.mouse.click(point[0] + 15, point[1]);
}

export async function emulateHover(page: PuppeteerPage, point: number[]) {
    await page.mouse.move(0, 0);
    await page.mouse.move(point[0], point[1], { steps: 50 });
}

export async function emulateDrag(page: PuppeteerPage) {
    await page.mouse.move(PAGE_CENTER[0], PAGE_CENTER[1], { steps: 50 });
    await page.mouse.down({ button: 'left' });
    await page.mouse.move(PAGE_CENTER[0] - 10, PAGE_CENTER[1] - 10, { steps: 50 });
    await page.mouse.up({ button: 'left' });
}
