import { Ruler, RulerOptions } from '../ruler';
export interface RulerControlOptions extends mapgl.ControlOptions {
    /**
     * Sets ruler's behavior. Specifies whether the ruler should be in measuring mode of the distance of a polyline or the area of a polygon.
     */
    mode?: RulerOptions['mode'];
    /**
     * Specifies whether the ruler should be enabled after control initialization.
     */
    enabled?: boolean;
}
/**
 * A class that provides a ruler control on the map.
 */
export declare class RulerControl extends mapgl.Control {
    private map;
    private readonly ruler;
    private readonly icon;
    private isEnabled;
    /**
     * Example:
     * ```js
     * const control = new mapgl.RulerControl(map, {{ position: 'centerRight' }});
     * control.getRuler().setPoints([
     *     [55.31878, 25.23584],
     *     [55.35878, 25.23584],
     *     [55.35878, 25.26584],
     * ]);
     * ```
     * @param map The map instance.
     * @param options Ruler control initialization options.
     */
    constructor(map: mapgl.Map, options: RulerControlOptions);
    /**
     * Destroys the control and the ruler.
     */
    destroy(): void;
    /**
     * Returns the ruler instance.
     */
    getRuler(): Ruler;
    /**
     * Toggle control. The same as clicking the button.
     */
    toggle(): void;
}
