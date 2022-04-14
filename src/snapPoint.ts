import { SnapInfo } from './types';
import { HtmlMarker } from '@2gis/mapgl/global';
import { getHtmlMarker, getLabel, getSnapPointLabelContent } from './utils';

/**
 * @hidden
 * @internal
 */
export class SnapPoint {
    private readonly map: mapgl.Map;
    private label: HtmlMarker;
    private marker?: HtmlMarker;

    constructor(map: mapgl.Map) {
        this.map = map;
        this.label = getLabel(this.map, this.map.getCenter(), '');
    }

    update(info: SnapInfo | undefined) {
        if (info === undefined) {
            this.hide();
            return;
        }

        this.label.setContent(getSnapPointLabelContent(info.distance, this.map.getLanguage()));
        this.label.setCoordinates(info.point);

        if (!this.marker) {
            this.marker = getHtmlMarker(this.map, info.point, {
                big: true,
            });
        } else {
            this.marker.setCoordinates(info.point);
        }
    }

    destroy() {
        this.label.destroy();
        this.marker?.destroy();
        this.marker = undefined;
    }

    private hide() {
        this.label.setContent('');
        this.marker?.destroy();
        this.marker = undefined;
    }
}
