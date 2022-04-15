import { geoPointsDistance } from './utils';
import { Joint } from './joint';
import { area } from './geo/area';
import { centroid } from './geo/centroid';
import { GeoPoint } from './types';
import { style } from './style';
import { dictionary } from './l10n';

export class Polygon {
    private readonly map: mapgl.Map;
    private label?: mapgl.Label;
    private polygon?: mapgl.Polygon;
    private area: number;
    private perimeter: number;

    constructor(map: mapgl.Map, joints: Joint[]) {
        this.map = map;
        this.area = 0;
        this.perimeter = 0;

        if (joints.length > 2) {
            const points = joints.map((j) => j.getCoordinates());
            this.polygon = createPolygon(this.map, points);
            this.label = createLabel(this.map, centroid(points), this.area);
        }
    }

    update(joints: Joint[]) {
        this.polygon?.destroy();
        if (joints.length <= 2) {
            this.perimeter = 0;
            this.area = 0;
            this.label?.destroy();
            return;
        }

        const points = joints.map((j) => j.getCoordinates());

        this.perimeter =
            joints[joints.length - 1].getDistance() +
            geoPointsDistance(points[points.length - 1], points[0]);

        this.area = area(points);

        this.polygon = createPolygon(this.map, points);

        this.label?.destroy();
        this.label = createLabel(this.map, centroid(points), this.area);
    }

    destroy() {
        this.label?.destroy();
        this.polygon?.destroy();
    }

    getArea() {
        return this.area;
    }

    getPerimeter() {
        return this.perimeter;
    }
}

function getLabelText(area: number, lang: string) {
    if (area < 1e5) {
        return `${area.toFixed(1)} ${dictionary.meter[lang]}²`;
    }

    return `${(area / 1e6).toFixed(1)} ${dictionary.kilometer[lang]}²`;
}

function createLabel(map: mapgl.Map, coordinates: GeoPoint, area: number): mapgl.Label {
    return new mapgl.Label(map, {
        coordinates,
        text: getLabelText(area, map.getLanguage()),
        zIndex: style.areaLabelPhase,
        fontSize: style.labelFontSize,
        color: style.labelColor,
        haloColor: style.labelHaloColor,
        haloRadius: 1,
    });
}

function createPolygon(map: mapgl.Map, points: GeoPoint[]): mapgl.Polygon {
    return new mapgl.Polygon(map, {
        coordinates: [points],
        zIndex: style.areaPhase,
        interactive: false,
        color: style.areaColor,
        strokeWidth: style.areaStrokeWidth,
    });
}
