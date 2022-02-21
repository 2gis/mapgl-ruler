import { Ruler } from '../src';

declare var window: any;

const map = new mapgl.Map('container', {
    center: [55.31878, 25.23584],
    zoom: 13,
    key: 'Your API access key',
});

const ruler = new Ruler(map, { enabled: false });
ruler.setPoints([
    [55.31878, 25.23584],
    [55.35878, 25.23584],
    [55.35878, 25.26584],
]);
ruler.enable();

window.addEventListener('resize', () => map.invalidateSize());
