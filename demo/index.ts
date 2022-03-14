import { RulerControl } from '../src/control';

declare var window: any;

window.map = new mapgl.Map('container', {
    center: [55.31878, 25.23584],
    zoom: 13,
    key: 'cb20c5bf-34d3-4f0e-9b2b-33e9b8edb57f',
});
window.map.setStyle({
    version: 1,
    name: 'псевдоночная тема для MapGL JS API',
    background: {
        color: '#1C2429',
    },
    layers: [],
    icons: {},
    labelingGroups: {},
});

window.rulerControl = new RulerControl(window.map, { position: 'centerRight' });
// window.ruler = new Ruler(window.map, {
//     enabled: false,
//     points: [
//         [55.31878, 25.23584],
//         [55.35878, 25.23584],
//         [55.35878, 25.26584],
//     ],
// });
// window.ruler.enable();

window.addEventListener('resize', () => window.map.invalidateSize());
