import { Ruler } from './ruler';
import { RulerControl } from './control';

if (typeof window !== 'undefined') {
    if ('mapgl' in window) {
        (mapgl as any).Ruler = Ruler;
        (mapgl as any).RulerControl = RulerControl;
    } else {
        // If it so happens that the plugin is initialized before mapgl, we will put it in a temporary variable
        // Mapgl will put everything into itself from it.
        if (!(window as any).__mapglPlugins) {
            (window as any).__mapglPlugins = {};
        }

        (window as any).__mapglPlugins.Ruler = Ruler;
        (window as any).__mapglPlugins.RulerControl = RulerControl;
    }
}

export { Ruler, RulerControl };
