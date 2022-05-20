import { Ruler, RulerControl } from '../src';

declare global {
    interface Window {
        sdk: {
            map: mapgl.Map;
            Map: typeof mapgl.Map;
        };
        ready: boolean;
        rulerChanged: boolean;
        rulerRedraw: number;
        ruler: Ruler;
        Ruler: typeof Ruler;
        control: RulerControl;
        Control: typeof RulerControl;
    }
}
