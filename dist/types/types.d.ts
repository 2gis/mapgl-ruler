/**
 * Possible modes of operation of the plugin.
 */
export declare type RulerMode = 'polyline' | 'polygon';
/**
 * Geographical points [longitude, latitude].
 */
export declare type GeoPoint = number[];
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
export declare type RulerData = PolygonData | PolylineData;
