import * as assert from 'assert';
import { area } from '../../src/geo/area';

describe('area', () => {
    it('ok', () => {
        const points = [
            [125, -15],
            [113, -22],
            [117, -37],
            [130, -33],
            [148, -39],
            [154, -27],
            [144, -15],
            [125, -15],
        ];
        const expected = 7748891609977;
        assert.equal(Math.round(area(points)), expected);
    });
});
