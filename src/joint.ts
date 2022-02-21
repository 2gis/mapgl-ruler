import { GeoPoint, TargetedEvent } from './types';
import {
    getHtmlMarker,
    getJointDistanceText,
    getLabel,
    getLabelHtml,
    getMarkerPopupHtml,
} from './utils';
import { Evented } from './evented';
import { styles } from './constants';

interface EventTable {
    mouseover: TargetedEvent<Joint>;
    mouseout: TargetedEvent<Joint>;
    dragstart: TargetedEvent<Joint>;
    dragend: TargetedEvent<Joint>;
    move: TargetedEvent<Joint>;
    destroy: TargetedEvent<Joint>;
}

let lastId = 0;

export class Joint extends Evented<EventTable> {
    public readonly id: number;
    private dragging = false;
    private hovered = false;
    private isFirst: boolean;
    private labelText?: string;
    private distance: number;
    private hoverTimer?: number;
    private coordinates: GeoPoint;
    private marker?: mapgl.HtmlMarker;
    private label?: mapgl.HtmlMarker;

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

        if (enableOnInit) {
            this.enable();
        }
    }

    disable() {
        this.marker?.destroy();
        this.marker = undefined;

        this.label?.destroy();
        this.label = undefined;

        document.removeEventListener('mousemove', this.onMouseMove);

        this.emit('destroy', { targetData: this });
    }

    enable() {
        this.marker = getHtmlMarker(this.map, this.getCoordinates(), this.isFirst);
        this.addMarkerEventListeners();

        this.labelText = getJointDistanceText(this.distance, this.isFirst, this.map.getLanguage());
        this.label = getLabel(this.map, this.getCoordinates(), this.labelText);
        this.addLabelEventListeners(false);

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
        this.labelText = getJointDistanceText(this.distance, this.isFirst, this.map.getLanguage());
        this.label?.setContent(getLabelHtml(this.labelText, styles.labelFontSize));
    }

    setAsFirstJoint() {
        if (!this.isFirst) {
            return;
        }

        this.isFirst = true;
        this.marker?.destroy();
        this.marker = getHtmlMarker(this.map, this.coordinates, this.isFirst);
        this.addMarkerEventListeners();

        this.setDistance(0, true);
    }

    enablePopup() {
        this.label?.setContent(getMarkerPopupHtml());
        this.addLabelEventListeners(true);
    }

    disablePopup() {
        this.label?.setContent(getLabelHtml(this.labelText, styles.labelFontSize));
        this.addLabelEventListeners(false);
    }

    private addMarkerEventListeners() {
        if (!this.marker) {
            return;
        }
        const el = this.marker.getContent();
        el.addEventListener('mousedown', () => {
            this.dragging = true;
            this.emit('dragstart', {
                targetData: this,
            });
        });
        el.addEventListener('mouseup', () => {
            this.dragging = false;
            this.label?.setCoordinates(this.coordinates);
            this.emit('dragend');
        });
        el.addEventListener('mouseover', this.onMouseOver);
        el.addEventListener('mouseout', this.onMouseOut);
    }

    private addLabelEventListeners(isPopup: boolean) {
        if (!this.label) {
            return;
        }
        const el = this.label.getContent();
        el.addEventListener('mouseover', this.onMouseOver);
        el.addEventListener('mouseout', this.onMouseOut);

        if (isPopup) {
            el.addEventListener('click', this.onClickLabel);
        }
    }

    private onClickLabel = () => {
        this.disable();
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
}
