import { GeoPoint, SnapInfo } from './types';
import { HtmlMarker } from '@2gis/mapgl/global';
import { getHtmlMarker, getLabel, getSnapPointLabelContent } from './utils';
import { RulerMode } from './ruler';

/**
 * @hidden
 * @internal
 */
export class SnapPoint {
    map: mapgl.Map;
    coordinate: GeoPoint;
    label: HtmlMarker;
    marker?: HtmlMarker;

    labelContent: string | HTMLElement;

    constructor(map: mapgl.Map) {
        this.map = map;
        this.coordinate = this.map.getCenter();
        this.labelContent = '';
        this.label = getLabel(this.map, this.coordinate, this.labelContent);
    }

    update(_mode: RulerMode, info: SnapInfo | undefined) {
        if (info === undefined) {
            this.hide();
            return;
        }

        this.coordinate = info.point;
        this.labelContent = getSnapPointLabelContent(info.distance, this.map.getLanguage());

        this.label.setContent(this.labelContent);
        this.label.setCoordinates(this.coordinate);

        if (!this.marker) {
            this.marker = getHtmlMarker(this.map, this.coordinate, true, false);
        } else {
            this.marker.setCoordinates(this.coordinate);
        }
    }

    destroy() {
        this.label.destroy();
        this.marker?.destroy();
        this.marker = undefined;
    }

    private hide() {
        this.labelContent = this.label.getContent();
        this.label.setContent('');
        this.marker?.destroy();
        this.marker = undefined;
    }
}
