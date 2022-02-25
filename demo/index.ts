import { Ruler } from '../src';

declare var window: any;

window.map = new mapgl.Map('container', {
    center: [55.31878, 25.23584],
    zoom: 13,
    key: 'Your API access key',
});

window.ruler = new Ruler(window.map, {
    enabled: false,
    points: [
        [55.31878, 25.23584],
        [55.35878, 25.23584],
        [55.35878, 25.26584],
    ],
});
window.ruler.enable();

window.addEventListener('resize', () => window.map.invalidateSize());
