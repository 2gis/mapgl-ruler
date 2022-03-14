import { Ruler } from '../ruler';
import styles from './index.module.css';
import icon from 'raw-loader!./icon.svg';

export class RulerControl extends mapgl.Control {
    public ruler: Ruler;
    private isEnabled: boolean;

    constructor(private map: mapgl.Map, options: mapgl.ControlOptions) {
        super(map, '', options);
        this.isEnabled = true;
        this.ruler = new Ruler(this.map, { enabled: this.isEnabled });

        this.render();
    }

    destroy() {
        this.ruler.destroy();
        super.destroy();
    }

    getRuler() {
        return this.ruler;
    }

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
