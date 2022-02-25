import { Ruler } from '../src';

export {};

window.sdk = {
    isSupported: mapgl.isSupported,
    notSupportedReason: mapgl.notSupportedReason,
} as any;
window.sdk.Map = mapgl.Map;
window.ready = false;
window.Ruler = Ruler;
