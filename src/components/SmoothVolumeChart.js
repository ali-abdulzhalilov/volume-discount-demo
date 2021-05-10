import React, {useEffect, useState, useCallback} from 'react';
import {LinePath} from "@visx/shape";
import {curveLinear} from "@visx/curve";
import {scaleLinear} from '@visx/scale';
import {HorizontalSlider} from "../components";

const poly = (a, b, c, n, x) => a * Math.pow(x + b, n) + c;
const fun = (x) => poly(0.01, 0, 5, 1.8, x);

function SmoothVolumeChart({top, left, width, height, pointCount, maxPossibleAmount}) {

    const [maxAmount, setMaxAmount] = useState(70);
    const [maxDiscount, setMaxDiscount] = useState(fun(maxAmount));
    useEffect(() => setMaxDiscount(fun(maxAmount)), [maxAmount]);

    const [minAmount, setMinAmount] = useState(10);

    const funLimited = (x) => x < minAmount ? 0 : Math.max(Math.min(fun(x), maxDiscount), 0);

    const dn = maxPossibleAmount / pointCount;
    const data = Array.from({length: pointCount}, (x, i) => ({x: i * dn, y: funLimited(i * dn)}));

    const xScale = scaleLinear({range: [0, width], domain: [0, maxPossibleAmount]});
    const yScale = scaleLinear({range: [height, 0], domain: [0, 100]});

    const getValue = useCallback((value) => value / width * maxPossibleAmount, [maxPossibleAmount, width]);

    // -----

    const [maxX, setMaxX] = useState(xScale(maxAmount) + left);
    useEffect(() => setMaxAmount(getValue(maxX - left)), [getValue, maxX, left]);

    const [minX, setMinX] = useState(xScale(minAmount) + left);
    useEffect(() => setMinAmount(getValue(minX - left)), [getValue, minX, left]);

    // -----

    return (
        <>
            <g transform={`translate(${left},${top})`}>
                <LinePath
                    curve={curveLinear}
                    data={data}
                    x={(d) => xScale(d.x) ?? 0}
                    y={(d) => yScale(d.y) ?? 0}
                    strokeWidth={2}
                    stroke="#000"
                />
            </g>

            <HorizontalSlider
                top={top}
                left={left}
                width={width}
                height={height}
                value={maxX}
                onDrag={(c) => setMaxX(c.x + c.dx)}
            />

            <HorizontalSlider
                top={top}
                left={left}
                width={width}
                height={height}
                value={minX}
                onDrag={(c) => setMinX(c.x + c.dx)}
            />
        </>
    );
}

export default SmoothVolumeChart;
