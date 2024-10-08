import { GeoPoint, JointFactory, TargetedEvent } from './types';
import {
    createHtmlMarker,
    getJointDistanceText,
    getLabelHtml,
    getMarkerPopupHtml,
    getMousePosition,
} from './utils';
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
    private label?: mapgl.HtmlMarker;
    private popup: mapgl.HtmlMarker;

    constructor(
        private readonly map: mapgl.Map,
        coordinates: GeoPoint,
        isFirstJoint: boolean,
        distance: number,
        enableOnInit,
        private showLabel: boolean,
        private renderCustomMarker: JointFactory = (map, coordinates, { isFirst, interactive }) =>
            createHtmlMarker(map, coordinates, { big: isFirst, interactive }),
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
        this.createHtmlMarker();
        this.addMarkerEventListeners();

        this.updateLabel();

        document.addEventListener('touchmove', this.onMouseMove);
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

        this.createHtmlMarker();
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

    setLabelVisibility(visible: boolean) {
        this.showLabel = visible;
        this.updateLabel();
    }

    updateLabel() {
        this.label?.destroy();
        if (this.showLabel) {
            this.label = createLabel(this.map, this.coordinates, this.distance, this.isFirst);
        }
    }

    private addMarkerEventListeners() {
        if (!this.marker) {
            return;
        }

        const el = this.marker.getContent();
        el.addEventListener('mousedown', this.omMouseDown);
        el.addEventListener('touchstart', this.omMouseDown);

        document.addEventListener('mouseup', this.onMouseUp);
        document.addEventListener('touchend', this.onMouseUp);
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

        const container = this.map.getContainer();

        if (ev.type === 'touchmove') {
            const evt = typeof ev.originalEvent === 'undefined' ? ev : ev.originalEvent;
            const touch = evt.touches[0] || evt.changedTouches[0];
            this.coordinates = this.map.unproject(
                getMousePosition(container, touch.pageX, touch.pageY),
            );
        } else if (ev.type === 'mousemove') {
            this.coordinates = this.map.unproject(
                getMousePosition(container, ev.clientX, ev.clientY),
            );
        }

        this.marker?.setCoordinates(this.coordinates);
    };

    private onMouseUp = () => {
        if (!this.dragging) {
            return;
        }
        this.dragging = false;
        this.emit('dragend');
    };

    private omMouseDown = () => {
        this.disablePopup();
        this.dragging = true;
        this.emit('dragstart', {
            targetData: this,
        });
    };

    private createHtmlMarker = () => {
        this.marker = this.renderCustomMarker(this.map, this.getCoordinates(), {
            isFirst: this.isFirst,
            interactive: true,
        });
    };
}

function createLabel(map: mapgl.Map, coordinates: GeoPoint, distance: number, isFirst: boolean) {
    const height = style.labelFontSize;
    const jointTotalWidth = style.jointWidth + style.jointBorderWidth + style.jointBorder2Width;
    return new mapgl.HtmlMarker(map, {
        coordinates,
        html: getLabelHtml(getJointDistanceText(distance, isFirst, map.getLanguage())),
        anchor: [-jointTotalWidth / 2 - 2, height / 2],
        zIndex: style.jointLabelPhase,
        interactive: false,
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
