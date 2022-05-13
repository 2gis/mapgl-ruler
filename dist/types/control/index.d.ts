import { Ruler } from '../ruler';
/**
 * Provide ruler control on map.
 */
export declare class RulerControl extends mapgl.Control {
    private map;
    private readonly ruler;
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
     * @param options Control initialization options.
     * @param enabled Enable on create.
     */
    constructor(map: mapgl.Map, options: mapgl.ControlOptions, enabled?: boolean);
    /**
     * Destroy control and ruler
     */
    destroy(): void;
    /**
     * Get Ruler object
     */
    getRuler(): Ruler;
}
