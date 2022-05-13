import { Evented } from './evented';
import { GeoPoint, ChangeEvent } from './types';
/**
 * The list of events that can be emitted by a Ruler instance.
 */
interface EventTable {
    /**
     * Emitted when the points are changed
     */
    change: ChangeEvent;
    /**
     * Emitted after the ruler is redrawn
     */
    redraw: undefined;
}
/**
 * Ruler initialization options
 */
interface RulerOptions {
    /**
     * Array of geographical points [longitude, latitude].
     */
    points?: GeoPoint[];
    /**
     * Draw ruler when instance will be created.
     */
    enabled?: boolean;
}
/**
 * A class that provides ruler functionality.
 */
export declare class Ruler extends Evented<EventTable> {
    private readonly map;
    private enabled;
    private redrawPolyline;
    private redrawPreviewLine;
    private redrawSnapPoint;
    private overed;
    private joints;
    private newSnapInfo?;
    private polyline?;
    private previewLine?;
    private currentDraggableJoint?;
    private snapPoint?;
    private language;
    /**
     * Example:
     * ```js
     * const ruler = new mapgl.Ruler(map, {});
     * ruler.setPoints([
     *     [55.31878, 25.23584],
     *     [55.35878, 25.23584],
     *     [55.35878, 25.26584],
     * ]);
     * ```
     * @param map The map instance.
     * @param options Ruler initialization options.
     */
    constructor(map: mapgl.Map, options: RulerOptions);
    /**
     * Destroy ruler.
     */
    destroy(): void;
    /**
     * Enable ruler display.
     */
    enable(): void;
    /**
     * Disable ruler display.
     */
    disable(): void;
    /**
     * Set new points. This will override the previous points.
     * @param points Array of geographical points [longitude, latitude].
     */
    setPoints(points: GeoPoint[]): void;
}
export {};
