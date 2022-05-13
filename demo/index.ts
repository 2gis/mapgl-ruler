import { RulerControl } from '../src';

declare var window: any;

window.map = new mapgl.Map('container', {
    center: [55.08743147277832, 24.80434400280096],
    zoom: 16,
    key: 'cb20c5bf-34d3-4f0e-9b2b-33e9b8edb57f',
});

window.rulerControl = new RulerControl(window.map, {
    position: 'centerRight',
    enabled: true,
    mode: 'polygon',
});
window.ruler = window.rulerControl.ruler;

window.ruler.on('change', () => console.log('change'));
window.ruler.on('redraw', () => console.log('redraw'));

window.ruler.setPoints([
    [55.082101821899414, 24.804694608268026],
    [55.084805488586426, 24.799708126178913],
    [55.09343147277832, 24.80434400280096],
    [55.09124279022217, 24.80944716233094],
]);

window.addEventListener('resize', () => window.map.invalidateSize());
