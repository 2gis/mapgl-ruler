import { RulerControl } from '../src';
import { RulerMode } from '../src/types';

const map = new mapgl.Map('container', {
    center: [55.08743147277832, 24.80434400280096],
    zoom: 16,
    key: 'cb20c5bf-34d3-4f0e-9b2b-33e9b8edb57f',
});
window.sdk = {
    map,
    Map: mapgl.Map,
};

const toggleModeControl = new mapgl.Control(
    map,
    `
        <form name="toggle-form" style="display: flex; flex-direction: column;">
        <div>
            <input id="polyline" name="mode" type="radio" value="polyline" />
            <label for="polyline">polyline</label>
        </div>
        <div>
            <input id="polygon" name="mode" type="radio" value="polygon" checked />
            <label for="polygon">polygon</label>
        </div>
        </form>
    `,
    {
        position: 'topLeft',
    },
);
const form = toggleModeControl.getContainer().querySelector('form');
if (form) {
    form.onchange = (ev: Event) => {
        const mode = (ev.target as HTMLInputElement).value as RulerMode;
        window.control.destroy();
        window.control = new RulerControl(map, {
            position: 'centerRight',
            mode,
        });
        window.ruler = window.control.getRuler();
    };
}
const languageControl = new mapgl.Control(
    map,
    `
        <select>
            <option>en</option>
            <option>ru</option>
            <option>ar</option>
        </select>
    `,
    {
        position: 'topLeft',
    },
);
const languageSelect = languageControl.getContainer().querySelector('select');
if (languageSelect) {
    languageSelect.onchange = () => {
        map.setLanguage(languageSelect[languageSelect.selectedIndex].textContent ?? 'en');
    };
}

window.control = new RulerControl(map, {
    position: 'centerRight',
    mode: 'polygon',
});
window.ruler = window.control.getRuler();
window.control.getRuler().setPoints([
    [55.082101821899414, 24.804694608268026],
    [55.084805488586426, 24.799708126178913],
    [55.09343147277832, 24.80434400280096],
]);

window.addEventListener('resize', () => map.invalidateSize());

map.on('idle', () => console.log('map idle'));
window.ruler.on('change', () => console.log('ruler change'));
window.ruler.on('redraw', () => console.log('ruler redraw'));
