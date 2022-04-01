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
    distance: number;
    segment: number;
}

/**
 * @hidden
 * @internal
 */
export interface TargetedEvent<T> {
    targetData: T;
}

export interface ChangeEvent {
    /**
     * An array of geographical points [longitude, latitude].
     */
    points: GeoPoint[];
    /**
     * True if it was user interaction
     */
    isUser: boolean;
}
