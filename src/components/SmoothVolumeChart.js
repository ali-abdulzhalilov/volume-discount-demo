import React, {useEffect, useState} from 'react';
import {LinePath} from "@visx/shape";
import {curveLinear} from "@visx/curve";
import {scaleLinear} from '@visx/scale';
import {HorizontalSlider} from "../components";
import PointAdjuster from "./PointAdjuster";

const poly = (a, b, c, n, x) => a * Math.pow(x + b, n) + c;
const fun = (x) => poly(0.1, 0, 0, 1.5, x);

function SmoothVolumeChart({top, left, width, height, pointCount, maxPossibleAmount}) {

    const xScale = scaleLinear({range: [0, width], domain: [0, maxPossibleAmount]});
    const yScale = scaleLinear({range: [height, 0], domain: [0, 100]});

    const [maxAmount, setMaxAmount] = useState(maxPossibleAmount-10);
    const [maxDiscount, setMaxDiscount] = useState(fun(maxAmount));
    useEffect(() => setMaxDiscount(fun(maxAmount)), [maxAmount]);
    const [minAmount, setMinAmount] = useState(10);

    const funLimited = (x) => x < minAmount ? 0 : Math.max(Math.min(fun(x), maxDiscount), 0);

    const dn = maxPossibleAmount / pointCount;
    const data = Array.from({length: pointCount}, (x, i) => ({x: i * dn, y: funLimited(i * dn)}));

    const [middlePoint, setMiddlePoint] = useState({
        x: minAmount + (maxAmount - minAmount) / 2,
        y: 0.5
    });
    // useEffect(() => console.log(middlePoint), [middlePoint]);


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
                value={xScale(maxAmount)+left}
                onDrag={(c) => setMaxAmount(xScale.invert(c.x + c.dx - left))}
            />

            <HorizontalSlider
                top={top}
                left={left}
                width={width}
                height={height}
                value={xScale(minAmount)+left}
                onDrag={(c) => setMinAmount(xScale.invert(c.x + c.dx - left))}
            />

            <PointAdjuster
                top={top}
                left={left}
                width={width}
                height={height}
                value={{x: xScale(middlePoint.x)+left, y: yScale(middlePoint.y)}}
                onDrag={(c) => setMiddlePoint({
                    x: xScale.invert(c.x + c.dx - left),
                    y: yScale.invert(c.y + c.dy)
                })}
            />
        </>
    );
}

export default SmoothVolumeChart;
