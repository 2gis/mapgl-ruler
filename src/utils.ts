import { GeoPoint, ScreenPoint, SnapInfo } from './types';
import { Joint } from './joint';
import { dictionary } from './l10n';
import { style } from './style';

const jointRemoveBtnSvg =
    'PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB3aWR0aD0iMjIiIGhlaWdodD0iMjIiPjxkZWZzPjxwYXRoIGlkPSJBIiBkPSJNMTIgMTAuNTg2bDMuNzkzLTMuNzkzIDEuNDE0IDEuNDE0TDEzLjQxNCAxMmwzLjc5MyAzLjc5My0xLjQxNCAxLjQxNEwxMiAxMy40MTRsLTMuNzkzIDMuNzkzLTEuNDE0LTEuNDE0TDEwLjU4NiAxMiA2Ljc5MyA4LjIwN2wxLjQxNC0xLjQxNEwxMiAxMC41ODZ6Ii8+PC9kZWZzPjxnIGZpbGwtcnVsZT0iZXZlbm9kZCIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoLTEgLTEpIj48Y2lyY2xlIGN4PSIxMiIgY3k9IjEyIiByPSIxMC41IiBmaWxsPSIjZmZmIiBzdHJva2U9IiMwMDAiIHN0cm9rZS1vcGFjaXR5PSIuMTUiLz48bWFzayBpZD0iQiIgZmlsbD0iI2ZmZiI+PHVzZSB4bGluazpocmVmPSIjQSIvPjwvbWFzaz48dXNlIGZpbGw9IiMwMDAiIGZpbGwtcnVsZT0ibm9uemVybyIgeGxpbms6aHJlZj0iI0EiLz48ZyBmaWxsPSIjMjYyNjI2IiBtYXNrPSJ1cmwoI0IpIj48cGF0aCBkPSJNMCAwaDI0djI0SDB6Ii8+PC9nPjwvZz48L3N2Zz4=';

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
export function createLine(map: mapgl.Map, points: GeoPoint[], preview: boolean): mapgl.Polyline {
    return new mapgl.Polyline(map, {
        coordinates: points,
        zIndex: style.linePhase,
        zIndex2: style.linePhase - 0.00001,
        zIndex3: style.linePhase - 0.00002,
        width: style.lineWidth,
        width2: preview ? 0 : style.lineWidth + 2 * style.lineBorderWidth,
        width3: preview
            ? 0
            : style.lineWidth + 2 * (style.lineBorderWidth + style.lineBorder2Width),
        color: preview ? style.previewLineColor : style.lineColor,
        color2: style.lineBorderColor,
        color3: style.lineBorder2Color,
        interactive: !preview,
    });
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
export function createHtmlMarker(
    map: mapgl.Map,
    coordinates: GeoPoint,
    opts: {
        big?: boolean;
        interactive?: boolean;
    },
): mapgl.HtmlMarker {
    return new mapgl.HtmlMarker(map, {
        coordinates,
        html: `<div style="
                user-select: none;
                position: absolute;
                width: ${opts.big ? style.jointWidth : style.jointSmallWidth}px;
                height: ${opts.big ? style.jointWidth : style.jointSmallWidth}px;
                top: ${opts.big ? '-6px' : '-4px'};
                left: ${opts.big ? '-6px' : '-4px'};
                background: ${style.jointColor};
                border-radius: 50%;
                border-style: solid;
                border-color: ${style.jointBorderColor};
                border-width: ${opts.big ? style.jointBorderWidth : style.jointSmallBorderWidth}px;
                box-shadow: 0 0 0 ${
                    opts.big ? style.jointBorder2Width : style.jointSmallBorder2Width
                }px ${style.jointBorder2Color};
                cursor: pointer;
            "></div`,
        zIndex: style.jointPhase,
        interactive: opts.interactive ?? false,
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
