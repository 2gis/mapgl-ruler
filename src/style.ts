const maxPhase = 10; // an even number that allows us not to go to a negative value when calculating elements.

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
