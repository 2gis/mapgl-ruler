import { GeoPoint } from '../types';

const earthRadius = 6371008.8;
const rad = (x: number) => (x * Math.PI) / 180;

/**
 * @hidden
 * @internal
 *
 * @return The approximate signed geodesic area of the polygon in square meters. Based on a https://trs.jpl.nasa.gov/handle/2014/40409
 */
export function area(points: GeoPoint[]): number {
    if (points.length <= 2) {
        return 0;
    }

    let total = 0;
    let p0, p1, p2: GeoPoint;

    points.forEach((point, index) => {
        p0 = point;
        p1 = points[(index + 1) % points.length];
        p2 = points[(index + 2) % points.length];

        total += Math.sin(rad(p1[1])) * (rad(p2[0]) - rad(p0[0]));
    });

    total = Math.abs(total * earthRadius * earthRadius) / 2;

    return total;
}
