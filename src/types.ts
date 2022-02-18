export type GeoPoint = number[];
export type ScreenPoint = number[];

export interface SnapInfo {
    point: GeoPoint;
    distance: number;
    segment: number;
}

export interface TargetedEvent<T> {
    targetData: T;
}
