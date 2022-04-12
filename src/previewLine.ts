import { Joint } from './joint';
import { GeoPoint } from './types';
import { getLine } from './utils';
import { RulerMode } from './ruler';

/**
 * @hidden
 * @internal
 */
export class PreviewLine {
    private readonly map: mapgl.Map;
    private draggableJoint?: Joint;
    private polyline?: mapgl.Polyline;

    constructor(map: mapgl.Map) {
        this.map = map;
    }

    destroy() {
        this.polyline?.destroy();
        this.draggableJoint = undefined;
    }

    getDraggableJoint(): Joint | undefined {
        return this.draggableJoint;
    }

    setDraggableJoint(joint?: Joint) {
        this.draggableJoint = joint;
    }

    update(mode: RulerMode, joints: Joint[]) {
        this.polyline?.destroy();
        if (this.draggableJoint) {
            const curr = joints.indexOf(this.draggableJoint);
            if (curr === -1) {
                return;
            }

            const coordinates: GeoPoint[] = [];

            // берем предыдущую точку либо замыкаемся с последней если рисуем полигон
            if (joints[curr - 1] || mode === 'area') {
                coordinates.push((joints[curr - 1] ?? joints[joints.length - 1]).getCoordinates());
            }

            coordinates.push(this.draggableJoint.getCoordinates());

            // берем следующую точку либо замыкаемся с первой если рисуем полигон
            if (joints[curr + 1] || mode === 'area') {
                coordinates.push((joints[curr + 1] ?? joints[0]).getCoordinates());
            }

            this.polyline = getLine(this.map, coordinates, true);
        }
    }
}
