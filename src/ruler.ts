import { Evented } from './evented';
import {
    GeoPoint,
    RulerEvent,
    ScreenPoint,
    SnapInfo,
    TargetedEvent,
    RulerData,
    RulerMode,
} from './types';
import { geoPointsDistance, getSnapPoint } from './utils';
import { Joint } from './joint';
import { SnapPoint } from './snapPoint';
import { Polygon } from './polygon';
import { PreviewLine } from './previewLine';
import { Polyline } from './polyline';

/**
 * The list of events that can be emitted by a Ruler instance.
 */
export interface RulerEventTable {
    /**
     * Emitted when the points are changed.
     */
    change: RulerEvent;

    /**
     * @hidden
     * @internal
     */
    redraw: undefined;
}

/**
 * Ruler initialization options.
 */
export interface RulerOptions {
    /**
     * An array of geographical points [longitude, latitude].
     */
    points?: GeoPoint[];

    /**
     * Sets ruler's behavior. Specifies whether the ruler should be in measuring mode of the distance of a polyline or the area of a polygon.
     */
    mode: RulerMode;

    /**
     * Specifies whether the ruler should be drawn on its initialization.
     */
    enabled?: boolean;
}

interface RedrawFlags {
    polyline: boolean;
    preview: boolean;
    snap: boolean;
}

/**
 * A class that provides ruler functionality.
 */
export class Ruler extends Evented<RulerEventTable> {
    private readonly mode: RulerMode;
    private readonly map: mapgl.Map;
    private readonly redrawFlags: RedrawFlags;
    private enabled = false;
    private overed = false;
    private language: string;
    private joints: Joint[] = [];
    private previewLine: PreviewLine;
    private snapPoint: SnapPoint;
    private polyline: Polyline;
    private newSnapInfo?: SnapInfo;
    private polygon?: Polygon;

    /**
     * Example:
     * ```js
     * const ruler = new mapgl.Ruler(map, {});
     * ruler.setPoints([
     *     [55.31878, 25.23584],
     *     [55.35878, 25.23584],
     *     [55.35878, 25.26584],
     * ]);
     * ```
     * @param map The map instance.
     * @param options Ruler initialization options.
     */
    constructor(map: mapgl.Map, options: RulerOptions) {
        super();
        this.map = map;
        this.mode = options.mode;
        this.language = this.map.getLanguage();
        this.redrawFlags = {
            polyline: false,
            preview: false,
            snap: false,
        };

        this.snapPoint = new SnapPoint(this.map);
        this.previewLine = new PreviewLine(this.map);

        this.polyline = new Polyline(this.map);
        this.polyline.on('mousemove', this.onPolylineMouseMove);
        this.polyline.on('mouseout', this.onPolylineMouseOut);
        this.polyline.on('click', this.onPolylineClick);

        options.points?.forEach((point, i) => this.addPoint(point, i));

        if (options.enabled ?? true) {
            this.enable();
        }
    }

    /**
     * Destroys the ruler.
     */
    destroy() {
        this.disable();
        this.joints = [];
    }

    /**
     * Enables the ruler display.
     */
    enable() {
        if (this.enabled) {
            return;
        }

        this.enabled = true;
        this.redrawFlags.polyline = true;

        if (this.mode === 'polygon') {
            this.polygon = new Polygon(this.map, this.joints);
        }

        this.map.on('click', this.onClick);
        this.joints.forEach((joint) => joint.enable());
        this.update();
    }

    /**
     * Disables the ruler display.
     */
    disable() {
        if (!this.enabled) {
            return;
        }

        this.enabled = false;

        this.polyline.destroy();
        this.previewLine.destroy();
        this.snapPoint.destroy();

        this.polygon?.destroy();
        this.polygon = undefined;

        this.joints.forEach((joint) => joint.disable());

        this.map.off('click', this.onClick);
    }

    /**
     * Sets new points. This overrides the previous points.
     * @param points An array of geographical points [longitude, latitude].
     */
    setPoints(points: GeoPoint[]): void {
        this.redrawFlags.polyline = true;
        this.joints.forEach((joint) => joint.disable());
        this.joints = [];
        points.forEach((point, i) => this.addPoint(point, i));
        this.sendRulerChangeEvent(false);
    }

    /**
     * Get some data depending on the ruler mode.
     */
    getData(): RulerData {
        switch (this.mode) {
            case 'polyline':
                return {
                    type: this.mode,
                    coordinates: this.joints.map((j) => j.getCoordinates()),
                    lengths: this.joints.map((j) => j.getDistance()),
                    length: this.joints[this.joints.length - 1].getDistance(),
                };
            case 'polygon':
                if (!this.polygon) {
                    throw new Error(`no polygon but '${this.mode}' mode use.`);
                }
                return {
                    type: this.mode,
                    coordinates: [this.joints.map((j) => j.getCoordinates())],
                    area: this.polygon.getArea() ?? 0,
                    perimeter: this.polygon.getPerimeter() ?? 0,
                    lengths: [
                        ...this.joints.map((j) => j.getDistance()),
                        this.polygon.getPerimeter(),
                    ],
                };
            default:
                throw new Error(`unknown mode: ${this.mode}`);
        }
    }

    /**
     * @hidden
     * @internal
     */
    private addPoint(point: GeoPoint, index: number) {
        this.redrawFlags.polyline = true;
        const isFirstMarker = this.joints.length === 0;

        let distance = 0;
        if (!isFirstMarker) {
            const prev = this.joints[index - 1];
            distance = prev.getDistance() + geoPointsDistance(prev.getCoordinates(), point);
        }

        const joint = new Joint(this.map, point, isFirstMarker, distance, this.enabled);

        joint.on('dragstart', this.onJointMoveStart);
        joint.on('dragend', this.onJointMoveEnd);
        joint.on('move', this.onJointMove);
        joint.on('removed', this.onJointRemoved);
        joint.on('mouseover', this.onJointMouseOver);
        joint.on('mouseout', this.onJointMouseOut);

        this.joints.splice(index, 0, joint);
    }

    /**
     * @hidden
     * @internal
     */
    private onJointMouseOver = (e: TargetedEvent<Joint>) => {
        this.overed = true;
        if (!this.previewLine.getDraggableJoint()) {
            e.targetData.enablePopup();
        }
    };

    /**
     * @hidden
     * @internal
     */
    private onJointMouseOut = (e: TargetedEvent<Joint>) => {
        this.overed = false;
        if (!this.previewLine.getDraggableJoint()) {
            e.targetData.disablePopup();
        }
    };

    /**
     * @hidden
     * @internal
     */
    private onJointRemoved = (e: TargetedEvent<Joint>) => {
        const disabled = e.targetData;
        const index = this.joints.indexOf(disabled);

        if (disabled.isFirstJoint() && this.joints.length > 1) {
            this.joints[index + 1].setAsFirstJoint();
        }
        this.joints.splice(index, 1);
        this.redrawFlags.polyline = true;
        this.overed = false;

        this.sendRulerChangeEvent(true);
    };

    /**
     * @hidden
     * @internal
     */
    private onJointMoveEnd = () => {
        this.redrawFlags.polyline = true;
        this.redrawFlags.preview = true;
        this.previewLine.getDraggableJoint()?.enablePopup();
        this.previewLine.setDraggableJoint(undefined);
        this.sendRulerChangeEvent(true);
    };

    /**
     * @hidden
     * @internal
     */
    private onJointMove = () => {
        this.redrawFlags.preview = true;
    };

    /**
     * @hidden
     * @internal
     */
    private onJointMoveStart = (e: TargetedEvent<Joint>) => {
        e.targetData.disablePopup();
        this.previewLine.setDraggableJoint(e.targetData);
    };

    /**
     * @hidden
     * @internal
     */
    private onPolylineMouseMove = (e: mapgl.DynamicObjectPointerEvent<mapgl.Polyline>) => {
        if (!this.previewLine.getDraggableJoint() && !this.overed) {
            this.newSnapInfo = getSnapPoint(this.map, this.joints, e.point);
            this.redrawFlags.snap = true;
        }
    };

    /**
     * @hidden
     * @internal
     */
    private onPolylineMouseOut = () => {
        this.redrawFlags.snap = true;
    };

    /**
     * @hidden
     * @internal
     */
    private onPolylineClick = (e: mapgl.DynamicObjectPointerEvent<mapgl.Polyline>) => {
        this.createSnapPoint(e.point);
        this.sendRulerChangeEvent(true);
    };

    /**
     * @hidden
     * @internal
     */
    private onClick = (e: mapgl.MapPointerEvent) => {
        this.addPoint(e.lngLat, this.joints.length);
        this.sendRulerChangeEvent(true);
    };

    /**
     * @hidden
     * @internal
     */
    private createSnapPoint(point: ScreenPoint) {
        const snap = getSnapPoint(this.map, this.joints, point);
        this.addPoint(snap.point, snap.segment + 1);
        this.redrawFlags.snap = true;
    }

    /**
     * @hidden
     * @internal
     */
    private sendRulerChangeEvent(isUser: boolean) {
        this.emit('change', {
            data: this.getData(),
            isUser,
        });
    }

    /**
     * @hidden
     * @internal
     */
    private update() {
        if (!this.enabled) {
            return;
        }

        if (this.language !== this.map.getLanguage()) {
            this.language = this.map.getLanguage();
            this.redrawFlags.polyline = true;
        }

        const emitRedrawEvent =
            this.redrawFlags.snap || this.redrawFlags.preview || this.redrawFlags.polyline;

        if (this.redrawFlags.polyline) {
            this.redrawFlags.polyline = false;
            this.polygon?.update(this.joints);
            this.polyline.update(this.mode, this.joints);
        }

        if (this.redrawFlags.preview) {
            this.redrawFlags.preview = false;
            this.previewLine.update(this.mode, this.joints);
        }

        if (this.redrawFlags.snap) {
            this.redrawFlags.snap = false;
            this.snapPoint.update(this.newSnapInfo);
            this.newSnapInfo = undefined;
        }

        if (emitRedrawEvent) {
            this.emit('redraw');
        }

        requestAnimationFrame(() => {
            this.update();
        });
    }
}
