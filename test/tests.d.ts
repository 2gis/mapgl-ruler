import { Ruler, RulerControl } from '../src';
import { SinonStatic, SinonSpy } from 'sinon';

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
        sinon: SinonStatic;
        spy: SinonSpy<any>;
    }
}
