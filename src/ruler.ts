import { Evented } from './evented';
import { GeoPoint, ScreenPoint, SnapInfo, TargetedEvent } from './types';
import { geoPointsDistance, getLine, getSnapPoint } from './utils';
import { Polyline, Map, DynamicObjectPointerEvent, MapPointerEvent } from '@2gis/mapgl/types';
import { Joint } from './joint';
import { SnapPoint } from './snapPoint';

interface RulerOptions {
    points?: GeoPoint[];
    enabled?: boolean;
}

export class Ruler extends Evented<any> {
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

    constructor(map: mapgl.Map, options: RulerOptions) {
        super();
        this.map = map;

        if (options.enabled ?? true) {
            options.points?.forEach((point, i) => this.addPoint(point, i));
            this.enable();
        }
    }

    destroy() {
        this.disable();
        this.joints = [];
    }

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

    setPoints(points: GeoPoint[]): void {
        this.redrawPolyline = true;
        this.joints.forEach((joint) => joint.disable());
        this.joints = [];
        points.forEach((point, i) => this.addPoint(point, i));
    }

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
        joint.on('destroy', this.onJointDestroy);
        joint.on('mouseover', this.onJointMouseOver);
        joint.on('mouseout', this.onJointMouseOut);

        this.joints.splice(index, 0, joint);
    }

    private onJointMouseOver = (e: TargetedEvent<Joint>) => {
        this.overed = true;
        if (!this.currentDraggableJoint) {
            e.targetData.enablePopup();
        }
    };

    private onJointMouseOut = (e: TargetedEvent<Joint>) => {
        this.overed = false;
        if (!this.currentDraggableJoint) {
            e.targetData.disablePopup();
        }
    };

    private onJointDestroy = (e: TargetedEvent<Joint>) => {
        const destroyed = e.targetData;
        const index = this.joints.indexOf(destroyed);

        if (destroyed.isFirstJoint() && this.joints.length > 1) {
            this.joints[index + 1].setAsFirstJoint();
        }
        this.joints.splice(index, 1);
        this.redrawPolyline = true;
        this.overed = false;
    };

    private onJointMoveEnd = () => {
        this.redrawPolyline = true;
        this.redrawPreviewLine = true;
        this.currentDraggableJoint = undefined;
    };

    private onJointMove = () => {
        this.redrawPreviewLine = true;
    };

    private onJointMoveStart = (e: TargetedEvent<Joint>) => {
        this.currentDraggableJoint = e.targetData;
    };

    private onPolylineMouseMove = (e: DynamicObjectPointerEvent<Polyline>) => {
        if (!this.currentDraggableJoint && !this.overed) {
            this.newSnapInfo = getSnapPoint(this.map, this.joints, e.point);
            this.redrawSnapPoint = true;
        }
    };

    private onPolylineMouseOut = () => {
        this.redrawSnapPoint = true;
    };

    private onPolylineClick = (e: DynamicObjectPointerEvent<Polyline>) => {
        this.createSnapPoint(e.point);
    };

    private onClick = (e: MapPointerEvent) => {
        this.addPoint(e.lngLat, this.joints.length);
    };

    private createSnapPoint(point: ScreenPoint) {
        const snap = getSnapPoint(this.map, this.joints, point);
        this.addPoint(snap.point, snap.segment + 1);
        this.redrawSnapPoint = true;
    }

    private update() {
        if (!this.enabled) {
            return;
        }

        if (this.redrawPolyline) {
            this.redrawPolyline = false;
            this.polyline?.destroy();

            const points: GeoPoint[] = [];
            this.joints.forEach((node, ind) => {
                points.push(node.getCoordinates());
                const isFirst = ind === 0;
                let distance = 0;
                if (!isFirst) {
                    const prev = this.joints[ind - 1];
                    distance =
                        prev.getDistance() +
                        geoPointsDistance(node.getCoordinates(), prev.getCoordinates());
                }
                node.setDistance(distance, isFirst);
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

        requestAnimationFrame(() => {
            this.update();
        });
    }
}