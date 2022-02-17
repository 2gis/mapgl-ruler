import {Ruler} from './ruler';

if (typeof window !== 'undefined') {
    if ('mapgl' in window) {
        (mapgl as any).Ruler = Ruler;
    } else {
        // Если так вышло, что плагин инициализирован раньше mapgl, поместим его во временную переменную
        // Из нее уже сам mapgl все положит в себя.
        if (!(window as any).__mapglPlugins) {
            (window as any).__mapglPlugins = {};
        }

        (window as any).__mapglPlugins.Ruler = Ruler;
    }
}

export { Ruler };
