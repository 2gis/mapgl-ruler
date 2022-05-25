import { GeoPoint } from '../types';

/**
 * @hidden
 * @internal
 */
export function centroid(points: GeoPoint[]): GeoPoint {
    const agg = points.reduce(
        (agg, value) => ({
            sumX: agg.sumX + value[0],
            sumY: agg.sumY + value[1],
            count: agg.count + 1,
        }),
        {
            sumX: 0,
            sumY: 0,
            count: 0,
        },
    );

    return [agg.sumX / agg.count, agg.sumY / agg.count];
}
