import { RulerControl } from '../src';
import { RulerMode } from '../src/types';

const map = new mapgl.Map('container', {
    center: [55.08743147277832, 24.80434400280096],
    zoom: 16,
    key: 'cb20c5bf-34d3-4f0e-9b2b-33e9b8edb57f',
});

const toggleModeControl = new mapgl.Control(
    map,
    `
        <form name="toggle-form" style="display: flex; flex-direction: column;">
        <div>
            <input id="polyline" name="mode" type="radio" value="polyline" checked />
            <label for="polyline">polyline</label>
        </div>
        <div>
            <input id="polygon" name="mode" type="radio" value="polygon" />
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
        control.destroy();
        control = new RulerControl(map, {
            position: 'centerRight',
            mode,
        });
    };
}
const languageControl = new mapgl.Control(
    map,
    `
        <select>
            <option>EN</option>
            <option>RU</option>
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

let control = new RulerControl(map, {
    position: 'centerRight',
    mode: 'polyline',
});
control.getRuler().setPoints([
    [55.082101821899414, 24.804694608268026],
    [55.084805488586426, 24.799708126178913],
    [55.09343147277832, 24.80434400280096],
]);

window.addEventListener('resize', () => map.invalidateSize());
