import { GeoPoint, SnapInfo } from './types';
import { createHtmlMarker, getJointDistanceText } from './utils';
import { style } from './style';
import { dictionary } from './l10n';

/**
 * @hidden
 * @internal
 */
export class SnapPoint {
    private label?: mapgl.HtmlMarker;
    private marker?: mapgl.HtmlMarker;
    private point: GeoPoint = [0, 0];
    private distance = 0;

    constructor(private readonly map: mapgl.Map, private showLabel: boolean) {}

    update(info: SnapInfo | undefined) {
        if (info === undefined) {
            this.destroy();
            return;
        }
        this.point = info.point;
        this.distance = info.distance;

        if (!this.marker) {
            this.marker = createHtmlMarker(this.map, this.point, {
                big: true,
                interactive: false,
            });
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
    const addJointText = dictionary.addPoint[lang] || dictionary.addPoint.en;

    return { distanceText, addJointText };
}

function getLabelHtml({ distanceText, addJointText }): string {
    return `
        <div style="font-size: ${style.labelFontSize}px;
            color: #667799;
            user-select: none;
            font-family: SuisseIntl, Helvetica, Arial, sans-serif;
            text-shadow: 1px 0px 1px #fff, -1px 0px 1px #fff, 0px 1px 1px #fff, 0px -1px 1px #fff;
            white-space: nowrap;
            cursor: pointer;
        ">
            <div style="text-shadow: 1px 0px 1px #fff, -1px 0px 1px #fff, 0px 1px 1px #fff, 0px -1px 1px #fff;
                user-select: none;
                color: #667799;
                font-family: SuisseIntl, Helvetica, Arial, sans-serif;
                font-size: 13px;
                margin: -6px 0 0 12px; /** отступы от точки наведения */
                white-space: nowrap;
                cursor: pointer;
            ">
                ${distanceText}
                <br>
                ${addJointText}
            </div>
        </div>
    `;
}
