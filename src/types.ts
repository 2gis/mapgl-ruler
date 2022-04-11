/**
 * Geographical points [longitude, latitude].
 */
export type GeoPoint = number[];

/**
 * @hidden
 * @internal
 */
export type ScreenPoint = number[];

/**
 * @hidden
 * @internal
 */
export interface SnapInfo {
    point: GeoPoint;
    segment: number;
    distance: number;
}

/**
 * @hidden
 * @internal
 */
export interface TargetedEvent<T> {
    targetData: T;
}

export interface ChangeEvent {
    info: RulerInfo;
    coordinates: RulerCoordinates;
    /**
     * True if it was user interaction
     */
    isUser: boolean;
}

export interface PolygonCoordinates {
    type: 'polygon';
    coordinates: GeoPoint[][];
}
export interface PolylineCoordinates {
    type: 'polyline';
    coordinates: GeoPoint[];
}
export type RulerCoordinates = PolygonCoordinates | PolylineCoordinates;

export interface PolygonInfo {
    type: 'polygon';
    area: number;
    perimeter: number;
}
export interface PolylineInfo {
    type: 'polyline';
    lengths: number[];
}
export type RulerInfo = PolygonInfo | PolylineInfo;
