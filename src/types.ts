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

export interface AreaCoordinates {
    type: 'area';
    coordinates: GeoPoint[][];
}
export interface DistanceCoordinates {
    type: 'distance';
    coordinates: GeoPoint[];
}
export type RulerCoordinates = AreaCoordinates | DistanceCoordinates;

export interface AreaInfo {
    type: 'area';
    area: number;
    perimeter: number;
}
export interface DistanceInfo {
    type: 'distance';
    lengths: number[];
}
export type RulerInfo = AreaInfo | DistanceInfo;
