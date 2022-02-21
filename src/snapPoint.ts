import { GeoPoint, SnapInfo } from './types';
import { CircleMarker, HtmlMarker } from '@2gis/mapgl/global';
import { getCircleMarker, getJointDistanceText, getLabel, getLinePopupHtml } from './utils';

export class SnapPoint {
    map: mapgl.Map;
    point: GeoPoint;
    distance: number;

    marker?: CircleMarker;
    label: HtmlMarker;
    labelText: string;

    constructor(map: mapgl.Map, info: SnapInfo) {
        this.map = map;
        this.distance = info.distance;
        this.point = info.point;

        this.labelText = getLinePopupHtml(
            getJointDistanceText(this.distance, false, this.map.getLanguage()),
            this.map.getLanguage(),
        );
        this.label = getLabel(this.map, this.point, '');
    }

    show() {
        this.label.setContent(this.labelText);
        this.marker = getCircleMarker(this.map, this.point, true, false);
    }

    hide() {
        this.label.setContent('');
        this.marker?.destroy();
    }

    update(info: SnapInfo) {
        this.distance = info.distance;
        this.point = info.point;

        this.labelText = getLinePopupHtml(
            getJointDistanceText(this.distance, false, this.map.getLanguage()),
            this.map.getLanguage(),
        );
        this.label.setContent(this.labelText);

        this.marker?.destroy();
        this.marker = getCircleMarker(this.map, this.point, true, false);
        this.label.setCoordinates(this.point);
    }

    destroy() {
        this.marker?.destroy();
        this.label.destroy();
    }
}
