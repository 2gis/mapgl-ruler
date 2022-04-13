import { geoPointsDistance, getPolygon, getLabel, getPolygonCentroid } from './utils';
import { Joint } from './joint';

export class Polygon {
    private readonly map: mapgl.Map;
    private label?: mapgl.HtmlMarker;
    private polygon?: mapgl.Polygon;
    private area: number;
    private perimeter: number;

    constructor(map: mapgl.Map, joints: Joint[]) {
        this.map = map;
        this.area = 0;
        this.perimeter = 0;

        if (joints.length > 2) {
            const points = joints.map((j) => j.getCoordinates());
            this.polygon = getPolygon(this.map, points);
            this.label = getLabel(this.map, getPolygonCentroid(points), this.getLabelContent());
        }
    }

    update(joints: Joint[]) {
        this.polygon?.destroy();
        if (joints.length <= 2) {
            return;
        }

        this.area = 0;
        this.perimeter =
            joints[joints.length - 1].getDistance() +
            geoPointsDistance(
                joints[joints.length - 1].getCoordinates(),
                joints[0].getCoordinates(),
            );

        const points = joints.map((j) => j.getCoordinates());
        this.polygon = getPolygon(this.map, points);
        if (!this.label) {
            this.label = getLabel(this.map, getPolygonCentroid(points), this.getLabelContent());
        } else {
            this.label?.setContent(this.getLabelContent());
            this.label?.setCoordinates(getPolygonCentroid(points));
        }
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

    private getLabelContent() {
        return `${this.area} m&#178;`;
    }
}
