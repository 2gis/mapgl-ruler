const maxPhase = 2147483647; // max zIndex in CSS (2 ** 31 - 1).

/**
 * @hidden
 * @internal
 */
export const style = {
    popupLabelPhase: maxPhase,
    linePhase: maxPhase - 1,
    jointLabelPhase: maxPhase - 1,
    jointPhase: maxPhase - 2,
    areaPhase: maxPhase - 2,

    areaColor: '#66779977',
    areaStrokeWidth: 0,

    jointWidth: 7,
    jointBorderWidth: 3,
    jointBorder2Width: 2,

    jointSmallWidth: 0,
    jointSmallBorderWidth: 4,
    jointSmallBorder2Width: 2,

    jointColor: '#ffffff',
    jointBorderColor: '#667799',
    jointBorder2Color: '#ffffff',

    lineWidth: 4,
    lineBorderWidth: 2,
    lineBorder2Width: 1,
    lineColor: '#667799',
    lineBorderColor: '#ffffff',
    lineBorder2Color: '#00000026',

    previewLineColor: '#66779966',

    labelFontSize: 13,
};
