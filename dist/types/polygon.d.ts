import { Joint } from './joint';
export declare class Polygon {
    private readonly map;
    private showLabel;
    private label?;
    private polygon?;
    private centroid;
    private area;
    private perimeter;
    constructor(map: mapgl.Map, joints: Joint[], showLabel: boolean);
    update(joints: Joint[]): void;
    destroy(): void;
    getArea(): number;
    getPerimeter(): number;
    setLabelVisibility(visible: boolean): void;
    private updateLabel;
}
