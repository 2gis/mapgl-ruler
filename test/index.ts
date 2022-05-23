import { Ruler, RulerControl } from '../src';
import * as sinon from 'sinon';

export {};

window.sdk = {
    isSupported: mapgl.isSupported,
    notSupportedReason: mapgl.notSupportedReason,
} as any;
window.sdk.Map = mapgl.Map;
window.ready = false;
window.Ruler = Ruler;
window.Control = RulerControl;
window.sinon = sinon;
