import { Ruler, RulerOptions } from '../ruler';
import styles from './index.module.css';
import icon_distance from 'raw-loader!./icon_distance.svg';
import icon_area from 'raw-loader!./icon_area.svg';
import { DEFAULT_RULER_MODE } from '../constants';

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
export class RulerControl extends mapgl.Control {
    private readonly ruler: Ruler;
    private readonly icon: any;
    private isEnabled: boolean;

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
    constructor(private map: mapgl.Map, options: RulerControlOptions) {
        super(map, '', options);
        const mode = options.mode ?? DEFAULT_RULER_MODE;
        this.isEnabled = options.enabled ?? true;
        switch (mode) {
            case 'polyline':
                this.icon = icon_distance;
                break;
            case 'polygon':
                this.icon = icon_area;
                break;
            default:
                throw new Error(`unsupported mode: ${mode}`);
        }
        this.ruler = new Ruler(this.map, { enabled: this.isEnabled, mode });

        this.render();
    }

    /**
     * Destroys the control and the ruler.
     */
    destroy() {
        this.ruler.destroy();
        super.destroy();
    }

    /**
     * Returns the ruler instance.
     */
    getRuler(): Ruler {
        return this.ruler;
    }

    /**
     * Toggle control. The same as clicking the control button.
     */
    toggle() {
        this.onClick();
    }

    /**
     * @hidden
     * @internal
     */
    private render = () => {
        this.getContainer().innerHTML = `
            <div class=${styles.root}>
                <button class="${styles.button}${this.isEnabled ? ' ' + styles.enabled : ''}"> ${
            this.icon
        }</button>
            </div>
        `;

        const btn = this.getContainer().querySelector(`.${styles.button}`) as HTMLButtonElement;
        btn.addEventListener('click', this.onClick);
    };

    /**
     * @hidden
     * @internal
     */
    private onClick = () => {
        if (this.isEnabled) {
            this.ruler.destroy();
            this.isEnabled = false;
        } else {
            this.ruler.enable();
            this.isEnabled = true;
        }

        this.render();
    };
}
