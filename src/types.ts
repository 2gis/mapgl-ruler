/**
 * Possible modes of operation of the plugin.
 */
export type RulerMode = 'polyline' | 'polygon';

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

export interface RulerEvent {
    /**
     * True if it was user interaction
     */
    isUser: boolean;
    data: RulerData;
}

export interface BaseData {
    type: RulerMode;
}

export interface PolygonData extends BaseData {
    type: 'polygon';
    coordinates: GeoPoint[][];
    lengths: number[];
    perimeter: number;
    area: number;
}

export interface PolylineData extends BaseData {
    type: 'polyline';
    coordinates: GeoPoint[];
    lengths: number[];
    length: number;
}

export type RulerData = PolygonData | PolylineData;
