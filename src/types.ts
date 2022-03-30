/**
 * @hidden
 * @internal
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
    points: GeoPoint[];
    isUser: boolean;
}
