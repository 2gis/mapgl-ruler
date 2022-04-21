import { GeoPoint, SnapInfo } from './types';
import { createHtmlMarker, getJointDistanceText } from './utils';
import { style } from './style';
import { dictionary } from './l10n';

/**
 * @hidden
 * @internal
 */
export class SnapPoint {
    private label?: mapgl.Label;
    private marker?: mapgl.HtmlMarker;

    constructor(private readonly map: mapgl.Map) {}

    update(info: SnapInfo | undefined) {
        if (info === undefined) {
            this.destroy();
            return;
        }

        if (!this.marker) {
            this.marker = createHtmlMarker(this.map, info.point, {
                big: true,
                interactive: false,
            });
        } else {
            this.marker.setCoordinates(info.point);
        }

        this.label?.destroy();
        this.label = createLabel(this.map, info.point, info.distance);
    }

    destroy() {
        this.label?.destroy();
        this.marker?.destroy();

        this.label = undefined;
        this.marker = undefined;
    }
}

function createLabel(map: mapgl.Map, coordinates: GeoPoint, distance: number): mapgl.Label {
    return new mapgl.Label(map, {
        coordinates,
        text: getLabelText(map, distance),
        fontSize: style.labelFontSize,
        zIndex: style.jointLabelPhase,
        color: style.labelColor,
        haloColor: style.labelHaloColor,
        haloRadius: 1,
        relativeAnchor: [0, 0.5],
        offset: [style.jointWidth + style.jointBorderWidth + style.jointBorder2Width, 0],
    });
}

function getLabelText(map: mapgl.Map, distance: number) {
    const distanceText = getJointDistanceText(distance, false, map.getLanguage());
    const addJointText = dictionary.addPoint[map.getLanguage()] || dictionary.addPoint.en;

    return `${distanceText}\n${addJointText}`;
}
