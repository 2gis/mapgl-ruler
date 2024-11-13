import { GeoPoint, SnapPointFactory, SnapInfo } from './types';
import { createHtmlMarker, getJointDistanceText, getLabelHtml, getSnapLabelHtml } from './utils';
import { style } from './style';
import { getTranslation } from './l10n';

/**
 * @hidden
 * @internal
 */
export class SnapPoint {
    private label?: mapgl.HtmlMarker;
    private marker?: mapgl.HtmlMarker;
    private point: GeoPoint = [0, 0];
    private distance = 0;

    constructor(
        private readonly map: mapgl.Map,
        private showLabel: boolean,
    ) {}

    update(
        info: SnapInfo | undefined,
        snapPointFactory: SnapPointFactory = (map, coordinates) =>
            createHtmlMarker(map, coordinates, { big: true, interactive: false }),
    ) {
        if (info === undefined) {
            this.destroy();
            return;
        }
        this.point = info.point;
        this.distance = info.distance;

        if (!this.marker) {
            this.marker = snapPointFactory(this.map, this.point);
        } else {
            this.marker.setCoordinates(this.point);
        }

        this.updateLabel();
    }

    destroy() {
        this.label?.destroy();
        this.marker?.destroy();

        this.label = undefined;
        this.marker = undefined;
        this.point = [0, 0];
        this.distance = 0;
    }

    setLabelVisibility(visible: boolean) {
        this.showLabel = visible;
        this.updateLabel();
    }

    updateLabel() {
        this.label?.destroy();
        if (this.showLabel) {
            this.label = createLabel(this.map, this.point, this.distance);
        }
    }
}

function createLabel(map: mapgl.Map, coordinates: GeoPoint, distance: number) {
    const html = getLabelHtml(getLabelText(map, distance));
    const height = style.labelFontSize;
    const jointTotalWidth = style.jointWidth + style.jointBorderWidth + style.jointBorder2Width;
    return new mapgl.HtmlMarker(map, {
        coordinates,
        html,
        anchor: [-jointTotalWidth / 2, height / 2],
        zIndex: style.jointLabelPhase,
        interactive: false,
    });
}

function getLabelText(map: mapgl.Map, distance: number) {
    const lang = map.getLanguage().toLowerCase();
    const distanceText = getJointDistanceText(distance, false, lang);
    const addJointText = getTranslation('addPoint', lang);

    return getSnapLabelHtml(distanceText, addJointText);
}
