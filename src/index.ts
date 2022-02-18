import { Ruler } from './ruler';

if (typeof window !== 'undefined') {
    if ('mapgl' in window) {
        (mapgl as any).Ruler = Ruler;
    } else {
        // If it so happens that the plugin is initialized before mapgl, we will put it in a temporary variable
        // Mapgl will put everything into itself from it.
        if (!(window as any).__mapglPlugins) {
            (window as any).__mapglPlugins = {};
        }

        (window as any).__mapglPlugins.Ruler = Ruler;
    }
}

export { Ruler };
