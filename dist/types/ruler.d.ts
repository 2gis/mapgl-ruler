import { Evented } from './evented';
import { GeoPoint, RulerEvent, RulerData, RulerMode } from './types';
/**
 * The list of events that can be emitted by a Ruler instance.
 */
export interface RulerEventTable {
    /**
     * Emitted when the points are changed.
     */
    change: RulerEvent;
}
/**
 * The list of visibility settings for label groups.
 */
export interface LabelVisibilitySettings {
    /**
     * Rule for snap point label. Enabled by default.
     */
    snapPoint?: boolean;
    /**
     * Rule for distance labels on perimeter. Enabled by default.
     */
    perimeter?: boolean;
    /**
     * Rule for area. Used with 'polygon'-mode. Enabled by default.
     */
    area?: boolean;
}
/**
 * Ruler initialization options.
 */
export interface RulerOptions {
    /**
     * An array of geographical points [longitude, latitude].
     */
    points?: GeoPoint[];
    /**
     * Sets ruler's behavior. Specifies whether the ruler should be in measuring mode of the distance of a polyline or the area of a polygon.
     */
    mode: RulerMode;
    /**
     * Specifies whether the ruler should be drawn on its initialization.
     */
    enabled?: boolean;
    /**
     * Specifies whether the labels should be drawn.
     */
    labelVisibilitySettings?: LabelVisibilitySettings;
}
/**
 * A class that provides ruler functionality.
 */
export declare class Ruler extends Evented<RulerEventTable> {
    private readonly mode;
    private readonly map;
    private readonly redrawFlags;
    private enabled;
    private overed;
    private language;
    private labelVisibilitySettings;
    private joints;
    private previewLine;
    private snapPoint;
    private polyline;
    private newSnapInfo?;
    private polygon?;
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
     * Destroys the ruler.
     */
    destroy(): void;
    /**
     * Enables the ruler display.
     */
    enable(): void;
    /**
     * Disables the ruler display.
     */
    disable(): void;
    /**
     * Sets new points. This overrides the previous points.
     * @param points An array of geographical points [longitude, latitude].
     */
    setPoints(points: GeoPoint[]): void;
    /**
     * Get some data depending on the ruler mode.
     */
    getData(): RulerData;
    /**
     * Set labels visibility.
     * @param settings Visibility settings for label groups.
     */
    setLabelsVisibility(settings: LabelVisibilitySettings): void;
}
