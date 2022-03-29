import { Evented } from './evented';
import { GeoPoint, ChangeEvent, ScreenPoint, SnapInfo, TargetedEvent } from './types';
import { geoPointsDistance, getLine, getSnapPoint } from './utils';
import { Polyline, Map, DynamicObjectPointerEvent, MapPointerEvent } from '@2gis/mapgl/types';
import { Joint } from './joint';
import { SnapPoint } from './snapPoint';

/**
 * The list of events that can be emitted by a Ruler instance.
 */
interface EventTable {
    /**
     * Emitted when the points are changed
     */
    change: ChangeEvent;

    /**
     * Emitted after the ruler is redrawn
     */
    redraw: undefined;
}

/**
 * Ruler initialization options
 */
interface RulerOptions {
    /**
     * Array of geographical points [longitude, latitude].
     */
    points?: GeoPoint[];

    /**
     * Draw ruler when instance will be created.
     */
    enabled?: boolean;
}

/**
 * A class that provides ruler functionality.
 */
export class Ruler extends Evented<EventTable> {
    private readonly map: Map;
    private enabled = false;
    private redrawPolyline = false;
    private redrawPreviewLine = false;
    private redrawSnapPoint = false;
    private overed = false;
    private joints: Joint[] = [];
    private newSnapInfo?: SnapInfo;
    private polyline?: Polyline;
    private previewLine?: mapgl.Polyline;
    private currentDraggableJoint?: Joint;
    private snapPoint?: SnapPoint;
    private language: string;

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
        this.language = this.map.getLanguage();

        options.points?.forEach((point, i) => this.addPoint(point, i));

        if (options.enabled ?? true) {
            this.enable();
        }
    }

    /**
     * Destroy ruler.
     */
    destroy() {
        this.disable();
        this.joints = [];
    }

    /**
     * Enable ruler display.
     */
    enable() {
        if (this.enabled) {
            return;
        }

        this.enabled = true;
        this.redrawPolyline = true;
        this.map.on('click', this.onClick);
        this.joints.forEach((joint) => joint.enable());
        this.update();
    }

    /**
     * Disable ruler display.
     */
    disable() {
        if (!this.enabled) {
            return;
        }

        this.enabled = false;
        this.polyline?.destroy();
        this.polyline = undefined;

        this.previewLine?.destroy();
        this.previewLine = undefined;

        this.snapPoint?.destroy();
        this.snapPoint = undefined;

        this.joints.forEach((joint) => joint.disable());

        this.map.off('click', this.onClick);
    }

    /**
     * Set new points. This will override the previous points.
     * @param points Array of geographical points [longitude, latitude].
     */
    setPoints(points: GeoPoint[]): void {
        this.redrawPolyline = true;
        this.joints.forEach((joint) => joint.disable());
        this.joints = [];
        points.forEach((point, i) => this.addPoint(point, i));
        this.sendRulerChangeEvent(false);
    }

    /**
     * @hidden
     * @internal
     */
    private addPoint(point: GeoPoint, index: number) {
        this.redrawPolyline = true;
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
        if (!this.currentDraggableJoint) {
            e.targetData.enablePopup();
        }
    };

    /**
     * @hidden
     * @internal
     */
    private onJointMouseOut = (e: TargetedEvent<Joint>) => {
        this.overed = false;
        if (!this.currentDraggableJoint) {
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
        this.redrawPolyline = true;
        this.overed = false;

        this.sendRulerChangeEvent(true);
    };

    /**
     * @hidden
     * @internal
     */
    private onJointMoveEnd = () => {
        this.redrawPolyline = true;
        this.redrawPreviewLine = true;
        this.currentDraggableJoint = undefined;

        this.sendRulerChangeEvent(true);
    };

    /**
     * @hidden
     * @internal
     */
    private onJointMove = () => {
        this.redrawPreviewLine = true;
    };

    /**
     * @hidden
     * @internal
     */
    private onJointMoveStart = (e: TargetedEvent<Joint>) => {
        this.currentDraggableJoint = e.targetData;
    };

    /**
     * @hidden
     * @internal
     */
    private onPolylineMouseMove = (e: DynamicObjectPointerEvent<Polyline>) => {
        if (!this.currentDraggableJoint && !this.overed) {
            this.newSnapInfo = getSnapPoint(this.map, this.joints, e.point);
            this.redrawSnapPoint = true;
        }
    };

    /**
     * @hidden
     * @internal
     */
    private onPolylineMouseOut = () => {
        this.redrawSnapPoint = true;
    };

    /**
     * @hidden
     * @internal
     */
    private onPolylineClick = (e: DynamicObjectPointerEvent<Polyline>) => {
        this.createSnapPoint(e.point);
        this.sendRulerChangeEvent(true);
    };

    /**
     * @hidden
     * @internal
     */
    private onClick = (e: MapPointerEvent) => {
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
        this.redrawSnapPoint = true;
    }

    /**
     * @hidden
     * @internal
     */
    private sendRulerChangeEvent(isUser: boolean): void {
        this.emit('change', {
            points: this.joints.map((joint) => joint.getCoordinates()),
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
            this.redrawPolyline = true;
        }

        const emitRedrawEvent = this.redrawPreviewLine || this.redrawPolyline;

        if (this.redrawPolyline) {
            this.redrawPolyline = false;
            this.polyline?.destroy();

            const points: GeoPoint[] = [];
            this.joints.forEach((joint, ind) => {
                const coords = joint.getCoordinates();
                const isFirst = ind === 0;
                let distance = 0;
                if (!isFirst) {
                    const prevDistance = this.joints[ind - 1].getDistance();
                    const prevCoordinates = this.joints[ind - 1].getCoordinates();
                    distance = prevDistance + geoPointsDistance(coords, prevCoordinates);
                }
                joint.setDistance(distance, isFirst);
                points.push(coords);
            });

            this.polyline = getLine(this.map, points, false);
            this.polyline.on('mousemove', this.onPolylineMouseMove);
            this.polyline.on('mouseout', this.onPolylineMouseOut);
            this.polyline.on('click', this.onPolylineClick);
        }

        if (this.redrawPreviewLine) {
            this.redrawPreviewLine = false;
            this.previewLine?.destroy();

            if (this.currentDraggableJoint) {
                const curr = this.joints.indexOf(this.currentDraggableJoint);
                const coordinates: GeoPoint[] = [];
                if (this.joints[curr - 1]) {
                    coordinates.push(this.joints[curr - 1].getCoordinates());
                }
                coordinates.push(this.currentDraggableJoint.getCoordinates());
                if (this.joints[curr + 1]) {
                    coordinates.push(this.joints[curr + 1].getCoordinates());
                }

                this.previewLine = getLine(this.map, coordinates, true);
            }
        }

        if (this.redrawSnapPoint) {
            this.redrawSnapPoint = false;
            if (this.newSnapInfo) {
                if (!this.snapPoint) {
                    this.snapPoint = new SnapPoint(this.map, this.newSnapInfo);
                    this.snapPoint.show();
                }
                this.snapPoint.update(this.newSnapInfo);
                this.newSnapInfo = undefined;
            } else {
                this.snapPoint?.hide();
            }
        }

        if (emitRedrawEvent) {
            this.emit('redraw');
        }

        requestAnimationFrame(() => {
            this.update();
        });
    }
}
