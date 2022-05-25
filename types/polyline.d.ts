import { RulerMode } from './types';
import { Joint } from './joint';
import { Evented } from './evented';
import { DynamicObjectPointerEvent } from '@2gis/mapgl/global';
interface EventTable {
    mousemove: DynamicObjectPointerEvent<mapgl.Polyline>;
    mouseout: DynamicObjectPointerEvent<mapgl.Polyline>;
    click: DynamicObjectPointerEvent<mapgl.Polyline>;
}
export declare class Polyline extends Evented<EventTable> {
    private map;
    private polyline?;
    constructor(map: mapgl.Map);
    update(mode: RulerMode, joints: Joint[]): void;
    destroy(): void;
}
export {};
