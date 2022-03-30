import { GeoPoint, ScreenPoint, SnapInfo } from './types';
import { Joint } from './joint';
import { dictionary } from './l10n';
import { jointRemoveBtnSvg, styles } from './constants';

/**
 * @hidden
 * @internal
 */
export function getJointDistanceText(distance: number, first: boolean, lang: string): string {
    if (first) {
        return dictionary.start[lang] || dictionary.start.en;
    }

    if (distance < 1000) {
        return `${distance} ${dictionary.meter[lang] || dictionary.meter.en}`;
    }

    const kmDist = (distance / 1000).toFixed(1);

    return `${kmDist} ${dictionary.kilometer[lang] || dictionary.kilometer.en}`;
}

function getAddJointText(lang: string): string {
    return dictionary.addPoint[lang] || dictionary.addPoint.en;
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
export function getLabelHtml(text: string | undefined, fontSize: number): string {
    return `
        <div style="font-size: ${fontSize}px;
            color: #667799;
            user-select: none;
            font-family: SuisseIntl, Helvetica, Arial, sans-serif;
            text-shadow: 1px 0px 1px #fff, -1px 0px 1px #fff, 0px 1px 1px #fff, 0px -1px 1px #fff;
            white-space: nowrap;
            cursor: pointer;
        ">
            ${text}
        </div>
    `;
}

/**
 * @hidden
 * @internal
 */
export function getLinePopupHtml(content: string, lang: string): string {
    return `
        <div style="text-shadow: 1px 0px 1px #fff, -1px 0px 1px #fff, 0px 1px 1px #fff, 0px -1px 1px #fff;
            user-select: none;
            color: #667799;
            font-family: SuisseIntl, Helvetica, Arial, sans-serif;
            font-size: 13px;
            margin: -12px 0 0 12px; /** отступы от точки наведения */
            white-space: nowrap;
            cursor: pointer;
        ">
            ${content}
            <br>
            ${getAddJointText(lang)}
        </div>
    `;
}

/**
 * @hidden
 * @internal
 */
export function getMarkerPopupHtml(): string {
    return `
        <img style="
            user-select: none;
            width: 24px;
            height: 24px;
            margin-top: -4px;
            cursor: pointer;
        " src="data:image/svg+xml;base64,${jointRemoveBtnSvg}" alt="close">
    `;
}

/**
 * @hidden
 * @internal
 */
export function getHtmlMarker(
    map: mapgl.Map,
    coordinates: GeoPoint,
    big: boolean,
): mapgl.HtmlMarker {
    return new mapgl.HtmlMarker(map, {
        coordinates,
        html: `<div style="
                user-select: none;
                position: absolute;
                width: ${big ? styles.jointWidth : styles.jointSmallWidth}px;
                height: ${big ? styles.jointWidth : styles.jointSmallWidth}px;
                top: ${big ? '-6px' : '-4px'};
                left: ${big ? '-6px' : '-4px'};
                background: ${styles.jointColor};
                border-radius: 50%;
                border-style: solid;
                border-color: ${styles.jointBorderColor};
                border-width: ${big ? styles.jointBorderWidth : styles.jointSmallBorderWidth}px;
                box-shadow: 0 0 0 ${
                    big ? styles.jointBorder2Width : styles.jointSmallBorder2Width
                }px ${styles.jointBorder2Color};
                cursor: pointer;
            "></div`,
        zIndex: styles.jointPhase,
    });
}

/**
 * @hidden
 * @internal
 */
export function getCircleMarker(
    map: mapgl.Map,
    coordinates: GeoPoint,
    big: boolean,
    interactive: boolean,
): mapgl.CircleMarker {
    return new mapgl.CircleMarker(map, {
        coordinates,
        interactive,
        diameter: big ? styles.jointWidth : styles.jointSmallWidth,
        strokeWidth: big ? styles.jointBorderWidth : styles.jointSmallBorderWidth,
        stroke2Width: big ? styles.jointBorder2Width : styles.jointSmallBorder2Width,
        color: styles.jointColor,
        strokeColor: styles.jointBorderColor,
        stroke2Color: styles.jointBorder2Color,
        zIndex: styles.snapPointPhase,
    });
}

/**
 * @hidden
 * @internal
 */
export function getLine(map: mapgl.Map, points: GeoPoint[], preview: boolean): mapgl.Polyline {
    return new mapgl.Polyline(map, {
        coordinates: points,
        zIndex: styles.linePhase,
        zIndex2: styles.linePhase - 0.00001,
        zIndex3: styles.linePhase - 0.00002,
        width: styles.lineWidth,
        width2: preview ? 0 : styles.lineWidth + 2 * styles.lineBorderWidth,
        width3: preview
            ? 0
            : styles.lineWidth + 2 * (styles.lineBorderWidth + styles.lineBorder2Width),
        color: preview ? styles.previewLineColor : styles.lineColor,
        color2: styles.lineBorderColor,
        color3: styles.lineBorder2Color,
        interactive: !preview,
    });
}

/**
 * @hidden
 * @internal
 */
export function getLabel(
    map: mapgl.Map,
    point: GeoPoint,
    text: string,
    isPopUp = false,
): mapgl.HtmlMarker {
    const content = getLabelHtml(text, styles.labelFontSize);
    const height = styles.labelFontSize;
    const jointTotalWidth = styles.jointWidth + styles.jointBorderWidth + styles.jointBorder2Width;
    const interactive = isPopUp;
    return new mapgl.HtmlMarker(map, {
        coordinates: point,
        html: content,
        anchor: [-(jointTotalWidth / 2 + 2), height / 2],
        zIndex: isPopUp ? styles.popupLabelPhase : styles.jointLabelPhase,
        interactive,
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
    const screenPoints = joints.map((joint) => {
        return map.project(joint.getCoordinates());
    });

    let minDistance = Infinity;
    let bestPoint = screenPoints[0];
    let bestSegmentIndex = 0;

    for (let i = 0; i < screenPoints.length - 1; i++) {
        const point1 = screenPoints[i];
        const point2 = screenPoints[i + 1];
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
