// The z-index value for this element is set to 10. This number is chosen to be lower than the z-index
// of controls and plugins in MapGL, which is 50. This approach allows us to manage the layering of elements
// without resorting to negative z-index values.

const maxPhase = 10;

/**
 * @hidden
 * @internal
 */
export const style = {
    popupLabelPhase: maxPhase,
    jointLabelPhase: maxPhase - 1,
    areaLabelPhase: maxPhase - 2,
    linePhase: maxPhase - 3,
    jointPhase: maxPhase - 4,
    areaPhase: maxPhase - 5,

    areaColor: '#8899bb77',
    areaStrokeWidth: 0,

    jointWidth: 7,
    jointBorderWidth: 3,
    jointBorder2Width: 2,

    lineWidth: 4,
    lineBorderWidth: 2,
    lineBorder2Width: 1,
    lineColor: '#667799',
    lineBorderColor: '#ffffff',
    lineBorder2Color: '#00000026',

    previewLineColor: '#66779966',

    labelFontSize: 13,
    labelColor: '#556688',
    labelHaloColor: '#fff',
};
