import { GeoPoint, TargetedEvent } from './types';
import { createHtmlMarker, getJointDistanceText, getMarkerPopupHtml } from './utils';
import { Evented } from './evented';
import { style } from './style';

interface EventTable {
    mouseover: TargetedEvent<Joint>;
    mouseout: TargetedEvent<Joint>;
    dragstart: TargetedEvent<Joint>;
    dragend: TargetedEvent<Joint>;
    move: TargetedEvent<Joint>;
    removed: TargetedEvent<Joint>;
}

let lastId = 0;

/**
 * @hidden
 * @internal
 */
export class Joint extends Evented<EventTable> {
    public readonly id: number;
    private dragging = false;
    private hovered = false;
    private isFirst: boolean;
    private distance: number;
    private hoverTimer?: ReturnType<typeof setTimeout>;
    private coordinates: GeoPoint;
    private marker?: mapgl.HtmlMarker;
    private label?: mapgl.Label;
    private popup: mapgl.HtmlMarker;

    constructor(
        private readonly map: mapgl.Map,
        coordinates: GeoPoint,
        isFirstJoint: boolean,
        distance: number,
        enableOnInit = true,
    ) {
        super();
        this.id = ++lastId;
        this.distance = distance;
        this.coordinates = coordinates;
        this.isFirst = isFirstJoint;
        this.popup = createPopup(this.map, this.coordinates);

        if (enableOnInit) {
            this.enable();
        }
    }

    destroy() {
        this.disable();
        this.popup.destroy();
    }

    disable() {
        this.disablePopup();

        this.marker?.destroy();
        this.marker = undefined;

        this.label?.destroy();
        this.label = undefined;

        document.removeEventListener('mouseup', this.onMouseUp);
        document.removeEventListener('mousemove', this.onMouseMove);
    }

    enable() {
        this.marker = createHtmlMarker(this.map, this.getCoordinates(), {
            big: this.isFirst,
            interactive: true,
        });
        this.addMarkerEventListeners();

        this.updateLabel();

        document.addEventListener('mousemove', this.onMouseMove);
    }

    getCoordinates() {
        return this.coordinates;
    }

    getDistance() {
        return this.distance;
    }

    isFirstJoint() {
        return this.isFirst;
    }

    setDistance(distance: number, isFirst: boolean) {
        this.distance = distance;
        this.isFirst = isFirst;

        this.hovered ? this.enablePopup() : this.disablePopup();
    }

    setAsFirstJoint() {
        if (this.isFirst) {
            return;
        }

        this.isFirst = true;

        this.marker?.destroy();
        document.removeEventListener('mouseup', this.onMouseUp);

        this.marker = createHtmlMarker(this.map, this.coordinates, {
            big: this.isFirst,
            interactive: true,
        });
        this.addMarkerEventListeners();
        this.setDistance(0, true);
    }

    enablePopup() {
        this.label?.destroy();
        this.popup.setCoordinates(this.coordinates);
        this.popup.setContent(getMarkerPopupHtml());
        this.addPopupEventListeners();
    }

    disablePopup() {
        this.popup.setContent('');
        this.updateLabel();
    }

    private addMarkerEventListeners() {
        if (!this.marker) {
            return;
        }

        const el = this.marker.getContent();
        el.addEventListener('mousedown', () => {
            this.disablePopup();
            this.dragging = true;
            this.emit('dragstart', {
                targetData: this,
            });
        });

        document.addEventListener('mouseup', this.onMouseUp);
        el.addEventListener('mouseover', this.onMouseOver);
        el.addEventListener('mouseout', this.onMouseOut);
    }

    private addPopupEventListeners() {
        const el = this.popup.getContent();
        el.addEventListener('mouseover', this.onMouseOver);
        el.addEventListener('mouseout', this.onMouseOut);
        el.addEventListener('click', this.onClickPopup);
    }

    private onClickPopup = () => {
        this.disable();
        this.emit('removed', { targetData: this });
    };

    private onMouseOver = () => {
        if (this.hovered) {
            return;
        }
        this.hovered = true;

        if (this.hoverTimer === undefined) {
            this.emit('mouseover', { targetData: this });
        }
    };

    private onMouseOut = () => {
        if (!this.hovered) {
            return;
        }
        this.hovered = false;
        this.hoverTimer = setTimeout(() => {
            if (!this.hovered) {
                this.emit('mouseout', {
                    targetData: this,
                });
                this.hoverTimer = undefined;
            }
        }, 100);
    };

    private onMouseMove = (ev) => {
        if (!this.dragging) {
            return;
        }

        this.emit('move', { targetData: this });

        this.coordinates = this.map.unproject([ev.clientX, ev.clientY]);
        this.marker?.setCoordinates(this.coordinates);
    };

    private onMouseUp = () => {
        if (!this.dragging) {
            return;
        }
        this.dragging = false;
        this.emit('dragend');
    };

    private updateLabel() {
        this.label?.destroy();
        this.label = createLabel(this.map, this.coordinates, this.distance, this.isFirst);
    }
}

function getLabelText(distance: number, isFirst: boolean, lang: string): string {
    return getJointDistanceText(distance, isFirst, lang);
}

function createLabel(
    map: mapgl.Map,
    coordinates: GeoPoint,
    distance: number,
    isFirst: boolean,
): mapgl.Label {
    return new mapgl.Label(map, {
        coordinates,
        text: getLabelText(distance, isFirst, map.getLanguage()),
        fontSize: style.labelFontSize,
        zIndex: style.jointLabelPhase,
        color: style.labelColor,
        haloColor: style.labelHaloColor,
        haloRadius: 1,
        relativeAnchor: [0, 0.5],
        offset: [style.jointWidth + style.jointBorderWidth + style.jointBorder2Width, 0],
    });
}

function createPopup(map: mapgl.Map, point: GeoPoint): mapgl.HtmlMarker {
    const height = style.labelFontSize;
    const jointTotalWidth = style.jointWidth + style.jointBorderWidth + style.jointBorder2Width;
    return new mapgl.HtmlMarker(map, {
        coordinates: point,
        html: '',
        anchor: [-jointTotalWidth / 2, height / 2],
        zIndex: style.popupLabelPhase,
        interactive: true,
    });
}
