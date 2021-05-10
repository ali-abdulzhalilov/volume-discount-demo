import React, {useEffect, useState, useCallback} from 'react';
import {LinePath} from "@visx/shape";
import {curveLinear} from "@visx/curve";
import {scaleLinear} from '@visx/scale';
import {HorizontalSlider} from "../components";
import PointAdjuster from "./PointAdjuster";

const poly = (a, b, c, n, x) => a * Math.pow(x + b, n) + c;
const fun = (x) => poly(0.01, 0, 5, 1.8, x);

function SmoothVolumeChart({top, left, width, height, pointCount, maxPossibleAmount}) {

    const xScale = scaleLinear({range: [0, width], domain: [0, maxPossibleAmount]});
    const yScale = scaleLinear({range: [height, 0], domain: [0, 100]});

    const getXValue = useCallback((value) => (value - left) / width * maxPossibleAmount, [maxPossibleAmount, width, left]);
    const getYValue = useCallback((value) => (1-(value - top) / height), [height, top]);

    const [maxAmount, setMaxAmount] = useState(120);
    const [maxDiscount, setMaxDiscount] = useState(fun(maxAmount));
    useEffect(() => setMaxDiscount(fun(maxAmount)), [maxAmount]);

    const [minAmount, setMinAmount] = useState(40);

    const funLimited = (x) => x < minAmount ? 0 : Math.max(Math.min(fun(x), maxDiscount), 0);

    const dn = maxPossibleAmount / pointCount;
    const data = Array.from({length: pointCount}, (x, i) => ({x: i * dn, y: funLimited(i * dn)}));

    const [middlePoint, setMiddlePoint] = useState({
        x: minAmount + (maxAmount - minAmount) / 2,
        y: funLimited(minAmount) + (funLimited(maxAmount) - funLimited(minAmount)) / 2
    });
    useEffect(() => console.log(middlePoint), [middlePoint]);

    // -----

    const [maxX, setMaxX] = useState(xScale(maxAmount) + left);
    useEffect(() => setMaxAmount(getXValue(maxX)), [getXValue, maxX]);

    const [minX, setMinX] = useState(xScale(minAmount) + left);
    useEffect(() => setMinAmount(getXValue(minX)), [getXValue, minX]);

    const [middleValue, setMiddleValue] = useState({x: xScale(middlePoint.x), y: yScale(middlePoint.y)});
    useEffect(() => setMiddlePoint({
        x: getXValue(middleValue.x),
        y: getYValue(middleValue.y)
    }), [getXValue, middleValue, getYValue]);

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

            <PointAdjuster
                top={top}
                left={left}
                width={width}
                height={height}
                value={middleValue}
                onDrag={(c) => setMiddleValue({x: c.x + c.dx, y: c.y + c.dy})}
            />
        </>
    );
}

export default SmoothVolumeChart;
