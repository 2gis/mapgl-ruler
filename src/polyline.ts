import { GeoPoint, RulerMode } from './types';
import { createLine, geoPointsDistance } from './utils';
import { Joint } from './joint';
import { Evented } from './evented';
import { DynamicObjectPointerEvent } from '@2gis/mapgl/global';

interface EventTable {
    mousemove: DynamicObjectPointerEvent<mapgl.Polyline>;
    mouseout: DynamicObjectPointerEvent<mapgl.Polyline>;
    click: DynamicObjectPointerEvent<mapgl.Polyline>;
}

/**
 * @internal
 * @hidden
 */
export class Polyline extends Evented<EventTable> {
    private polyline?: mapgl.Polyline;

    constructor(private map: mapgl.Map) {
        super();
    }

    update(mode: RulerMode, joints: Joint[]) {
        this.polyline?.destroy();
        if (joints.length === 0) {
            return;
        }

        const points: GeoPoint[] = joints.map((joint, ind) => {
            const coords = joint.getCoordinates();
            const isFirst = ind === 0;
            let distance = 0;
            if (!isFirst) {
                const prevDistance = joints[ind - 1].getDistance();
                const prevCoordinates = joints[ind - 1].getCoordinates();
                distance = prevDistance + geoPointsDistance(coords, prevCoordinates);
            }
            joint.setDistance(distance, isFirst);
            return coords;
        });

        // замыкаем линию если рисуем площадь
        if (mode === 'polygon') {
            points.push(joints[0].getCoordinates());
        }

        this.polyline = createLine(this.map, points, false);
        this.polyline.on('mousemove', (ev) => this.emit('mousemove', ev));
        this.polyline.on('mouseout', (ev) => this.emit('mouseout', ev));
        this.polyline.on('click', (ev) => this.emit('click', ev));
    }

    destroy() {
        this.polyline?.destroy();
    }
}
