import { Ruler } from '../ruler';
import styles from './index.module.css';
import icon from 'raw-loader!./icon.svg';

/**
 * A class that provides a ruler control on the map.
 */
export class RulerControl extends mapgl.Control {
    private readonly ruler: Ruler;
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
     * @param options Control initialization options.
     * @param enabled Specifies whether the ruler should be enabled.
     */
    constructor(private map: mapgl.Map, options: mapgl.ControlOptions, enabled = true) {
        super(map, '', options);
        this.isEnabled = enabled;
        this.ruler = new Ruler(this.map, { enabled: this.isEnabled, mode: 'polyline' });

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
     * @hidden
     * @internal
     */
    private render = () => {
        this.getContainer().innerHTML = `
            <div class=${styles.root}>
                <button class="${styles.button} ${
            this.isEnabled ? styles.enabled : undefined
        }"> ${icon}</button>
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
