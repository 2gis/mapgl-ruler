import { Ruler } from '../src';

declare var window: any;

window.map = new mapgl.Map('container', {
    center: [55.08743147277832, 24.80434400280096],
    zoom: 16,
    key: 'cb20c5bf-34d3-4f0e-9b2b-33e9b8edb57f',
});

window.ruler = new Ruler(window.map, {
    mode: 'polygon',
    points: [
        [55.082101821899414, 24.804694608268026],
        [55.084805488586426, 24.799708126178913],
        [55.09343147277832, 24.80434400280096],
        [55.09124279022217, 24.80944716233094],
    ],
    labelsVisibility: {
        snapPoint: false,
        area: false,
        perimeter: false,
    },
});
window.ruler.setLabelsVisibility({
    snapPoint: true,
    area: true,
    perimeter: true,
});

window.ruler.on('change', () => console.log('change'));
window.ruler.on('redraw', () => console.log('redraw'));
window.addEventListener('resize', () => window.map.invalidateSize());
