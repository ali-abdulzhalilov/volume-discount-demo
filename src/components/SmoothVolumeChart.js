import React from 'react';
import {LinePath} from "@visx/shape";
import {curveCardinal} from "@visx/curve";
import {scaleLinear} from '@visx/scale';

function SmoothVolumeChart({top, left, width, height, N}) {

    const poly = (a, b, c, n, x) => a * Math.pow(x + b, n) + c;

    const maxPercent = 70;
    const fun = (x) => Math.min(poly(0.01, 0, 0, 2, x), maxPercent);

    const data = Array.from({length: N}, (x, i) => ({x: i, y: fun(i)}));

    const getX = (d) => d.x;
    const getY = (d) => d.y;

    const xScale = scaleLinear({range: [0, width], domain: [0, N]});
    const yScale = scaleLinear({range: [height, 0], domain: [0, 100]});

    const getScaledX = (d) => xScale(getX(d)) ?? 0;
    const getScaledY = (d) => yScale(getY(d)) ?? 0;


    return (
        <>
            <g transform={`translate(${left},${top})`}>
                <LinePath
                    curve={curveCardinal}
                    data={data}
                    x={getScaledX}
                    y={getScaledY}
                    strokeWidth={2}
                    stroke="#000"
                />
            </g>
        </>
    );
}

export default SmoothVolumeChart;
