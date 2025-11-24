import { GeoPoint, RulerPolylineOptions, ScreenPoint, SnapInfo } from './types';
import { Joint } from './joint';
import { getTranslation } from './l10n';
import { style as styleDefault } from './style';
import { JOINT_REMOVE_BUTTON_SVG } from './constants';
import css from './index.module.css';

/**
 * @hidden
 * @internal
 */
export function getJointDistanceText(
    distance: number | undefined,
    first: boolean,
    lang: string,
): string {
    if (distance === undefined) {
        return '';
    }
    lang = lang.toLowerCase();

    if (first) {
        return getTranslation('start', lang);
    }

    if (distance < 1000) {
        return `${distance} ${getTranslation('meter', lang)}`;
    }

    const kmDist = (distance / 1000).toFixed(1);

    return `${kmDist} ${getTranslation('kilometer', lang)}`;
}

/**
 * @hidden
 * @internal
 */
export function geoPointsDistance(lngLat1: GeoPoint, lngLat2: GeoPoint): number {
    const R = 6371000;
    const rad = Math.PI / 180;
    const lat1 = lngLat1[1] * rad;
    const lat2 = lngLat2[1] * rad;
    const sinDLat = Math.sin(((lngLat2[1] - lngLat1[1]) * rad) / 2);
    const sinDLon = Math.sin(((lngLat2[0] - lngLat1[0]) * rad) / 2);
    const a = sinDLat * sinDLat + Math.cos(lat1) * Math.cos(lat2) * sinDLon * sinDLon;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return Math.round(R * c);
}

/**
 * @hidden
 * @internal
 */
export function createLine(
    map: mapgl.Map,
    points: GeoPoint[],
    preview: boolean,
    options?: RulerPolylineOptions,
): mapgl.Polyline {
    const lineWidth = options?.lineWidth ?? styleDefault.lineWidth;
    const lineColor = options?.lineColor ?? styleDefault.lineColor;
    const lineBorderColor = options?.lineBorderColor ?? styleDefault.lineBorderColor;
    const lineBorderWidth = options?.lineBorderWidth ?? styleDefault.lineBorderWidth;
    const lineBorder2Color = options?.lineBorder2Color ?? styleDefault.lineBorder2Color;
    const lineBorder2Width = options?.lineBorder2Width ?? styleDefault.lineBorder2Width;
    const previewLineColor = options?.previewLineColor ?? styleDefault.previewLineColor;

    return new mapgl.Polyline(map, {
        coordinates: points,
        zIndex: styleDefault.linePhase,
        zIndex2: styleDefault.linePhase - 0.00001,
        zIndex3: styleDefault.linePhase - 0.00002,
        width: lineWidth,
        width2: preview ? 0 : lineWidth + 2 * lineBorderWidth,
        width3: preview ? 0 : lineWidth + 2 * (lineBorderWidth + lineBorder2Width),
        color: preview ? previewLineColor : lineColor,
        color2: lineBorderColor,
        color3: lineBorder2Color,
        interactive: !preview,
    });
}

/**
 * @hidden
 * @internal
 */
export function getSnapLabelHtml(firstLine: string, secondLine: string): string {
    return `<div class=${css.snap}>${firstLine}<br>${secondLine}</div>`;
}

/**
 * @hidden
 * @internal
 */
export function getMarkerPopupHtml(): string {
    return `<img class=${css.cross} src="data:image/svg+xml;base64,${JOINT_REMOVE_BUTTON_SVG}" alt="close">`;
}

/**
 * @hidden
 * @internal
 */

export function getLabelHtml(content: string): string {
    return `<div class=${css.label}>${content}</div>`;
}

/**
 * @hidden
 * @internal
 */
export function createHtmlMarker(
    map: mapgl.Map,
    coordinates: GeoPoint,
    opts: {
        big?: boolean;
        interactive?: boolean;
        style?: string;
    },
): mapgl.HtmlMarker {
    return new mapgl.HtmlMarker(map, {
        coordinates,
        html: `<div class="${css.joint}${opts.big ? ' ' + css.big : ''}"></div`,
        zIndex: styleDefault.jointPhase,
        interactive: opts.interactive ?? false,
        labeling: { type: 'invincible', width: 20, height: 20 },
    });
}

/**
 * @hidden
 * @internal
 */
export function getClosestPointOnLineSegment(
    point: number[],
    point1: number[],
    point2: number[],
): number[] {
    const A = point[0] - point1[0];
    const B = point[1] - point1[1];
    const C = point2[0] - point1[0];
    const D = point2[1] - point1[1];

    const dot = A * C + B * D;
    const lengthSquared = C * C + D * D;
    const param = lengthSquared !== 0 ? dot / lengthSquared : 0;

    if (param < 0) {
        return point1;
    } else if (param > 1) {
        return point2;
    } else {
        return [point1[0] + param * C, point1[1] + param * D];
    }
}

/**
 * @hidden
 * @internal
 */
export function getSnapPoint(map: mapgl.Map, joints: Joint[], point: ScreenPoint): SnapInfo {
    const screenPoints = joints.map((joint) => map.project(joint.getCoordinates()));

    let minDistance = Infinity;
    let bestPoint = screenPoints[0];
    let bestSegmentIndex = 0;

    for (let i = 0; i < screenPoints.length; i++) {
        const point1 = screenPoints[i];
        const point2 = screenPoints[i + 1] ?? screenPoints[0];
        const closestPoint = getClosestPointOnLineSegment(point, point1, point2);

        const dx = closestPoint[0] - point[0];
        const dy = closestPoint[1] - point[1];
        const distanceSquared = dx * dx + dy * dy;

        if (distanceSquared < minDistance) {
            minDistance = distanceSquared;
            bestPoint = closestPoint;
            bestSegmentIndex = i;
        }
    }

    const geoPoint = map.unproject(bestPoint);

    const distance =
        joints[bestSegmentIndex].getDistance() +
        geoPointsDistance(geoPoint, joints[bestSegmentIndex].getCoordinates());

    return { point: geoPoint, distance, segment: bestSegmentIndex };
}

export function getMousePosition(
    container: HTMLElement,
    clientX: number,
    clientY: number,
): number[] {
    const rect = container.getBoundingClientRect();
    return [clientX - rect.left - container.clientLeft, clientY - rect.top - container.clientTop];
}
