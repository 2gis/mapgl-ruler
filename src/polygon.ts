import { geoPointsDistance } from './utils';
import { Joint } from './joint';
import { area } from './geo/area';
import { centroid } from './geo/centroid';
import { GeoPoint, RulerPolygonOptions } from './types';
import { style } from './style';
import { getTranslation } from './l10n';
import { PolygonOptions } from '@2gis/mapgl/types/types';

/**
 * @internal
 * @hidden
 */
export class Polygon {
    private label?: mapgl.Label;
    private polygon?: mapgl.Polygon;
    private centroid: GeoPoint;
    private area: number;
    private perimeter: number;

    constructor(
        private readonly map: mapgl.Map,
        joints: Joint[],
        private showLabel: boolean,
        options: Pick<PolygonOptions, 'color' | 'strokeColor' | 'strokeWidth'>,
    ) {
        this.area = 0;
        this.perimeter = 0;
        this.centroid = [0, 0];

        if (joints.length > 2) {
            const points = joints.map((j) => j.getCoordinates());
            this.polygon = createPolygon(this.map, points, options);
            this.centroid = centroid(points);
            this.updateLabel();
        }
    }

    update(joints: Joint[], options: RulerPolygonOptions) {
        this.polygon?.destroy();
        if (joints.length <= 2) {
            this.perimeter = 0;
            this.area = 0;
            this.label?.destroy();
            return;
        }

        const points = joints.map((j) => j.getCoordinates());

        this.centroid = centroid(points);
        this.perimeter =
            joints[joints.length - 1].getDistance() +
            geoPointsDistance(points[points.length - 1], points[0]);

        this.area = area(points);
        this.polygon = createPolygon(this.map, points, options);
        this.updateLabel();
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

    setLabelVisibility(visible: boolean) {
        this.showLabel = visible;
        this.updateLabel();
    }

    updateLabel() {
        this.label?.destroy();
        if (this.showLabel) {
            this.label = createLabel(this.map, this.centroid, this.area);
        }
    }
}

function getLabelText(area: number, lang: string) {
    lang = lang.toLowerCase();
    if (area < 1e5) {
        return `${area.toFixed(1)} ${getTranslation('meter', lang)}²`;
    }

    return `${(area / 1e6).toFixed(1)} ${getTranslation('kilometer', lang)}²`;
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

function createPolygon(
    map: mapgl.Map,
    points: GeoPoint[],
    options: RulerPolygonOptions,
): mapgl.Polygon {
    return new mapgl.Polygon(map, {
        coordinates: [points],
        zIndex: style.areaPhase,
        interactive: false,
        color: options.color ?? style.areaColor,
        strokeWidth: style.areaStrokeWidth,
    });
}
