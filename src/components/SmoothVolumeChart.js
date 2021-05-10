import React, {useEffect, useState, useCallback} from 'react';
import {LinePath} from "@visx/shape";
import {curveLinear} from "@visx/curve";
import {scaleLinear} from '@visx/scale';
import {HorizontalSlider} from "../components";

function SmoothVolumeChart({top, left, width, height, pointCount, maxPossibleAmount}) {

    const poly = (a, b, c, n, x) => a * Math.pow(x + b, n) + c;
    const fun = useCallback((x) => poly(0.01, 0, 0, 1.9, x), []);

    const [maxX, setMaxX] = useState(70);
    const [maxY, setMaxY] = useState(fun(maxX));
    useEffect(() => {setMaxY(fun(maxX))}, [fun, maxX]);
    const funWithLimit = (x) => Math.min(fun(x), maxY);

    const dn = maxPossibleAmount/pointCount;
    const data = Array.from({length: pointCount}, (x, i) => ({x: i*dn, y: funWithLimit(i*dn)}));

    const xScale = scaleLinear({range: [0, width], domain: [0, maxPossibleAmount]});
    const yScale = scaleLinear({range: [height, 0], domain: [0, 100]});

    const getScaledX = (d) => xScale(d.x) ?? 0;
    const getScaledY = (d) => yScale(d.y) ?? 0;

    // -----

    const [xx, setXX] = useState(xScale(maxX)+left);
    const [isDragging, setIsDragging] = useState(false);
    const getValue = (value) => value/width*maxPossibleAmount;

    const onDrag = c => {setXX(c.x+c.dx); setIsDragging(c.isDragging); getValue(c.x+c.dx-left); setMaxX(getValue(c.x+c.dx-left))};

    // -----

    return (
        <>
            <g transform={`translate(${left},${top})`}>
                <LinePath
                    curve={curveLinear}
                    data={data}
                    x={getScaledX}
                    y={getScaledY}
                    strokeWidth={2}
                    stroke="#000"
                />
            </g>

            <HorizontalSlider
                top={top}
                left={left}
                width={width}
                height={height}
                value={xx}
                isDragging={isDragging}
                onDrag={onDrag}
            />
        </>
    );
}

export default SmoothVolumeChart;
