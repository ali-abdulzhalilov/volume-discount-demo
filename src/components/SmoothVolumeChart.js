import React, {useEffect, useState} from 'react';
import {Line, LinePath} from "@visx/shape";
import {curveLinear} from "@visx/curve";
import {scaleLinear} from '@visx/scale';
import {HorizontalSlider} from "../components";
import PointAdjuster from "./PointAdjuster";

const poly = (a, b, c, n, x) => a * Math.pow(x + b, n) + c;
const fun = (x) => poly(0.1, 0, 0, 1.5, x);

const interpolate = (points, x) => {
    let res = 0;

    for (let i = 0; i < points.length; i++) {
        let term = points[i].y;

        for (let j = 0; j < points.length; j++) {
            if (j !== i) {
                term = term*(x - points[j].x) / (points[i].x - points[j].x);
            }
        }

        res += term;
    }

    return res;
}

const setWithLimit = (point, lowerPoint = point, higherPoint = point) => ({
    x: Math.min(Math.max(point.x, lowerPoint.x), higherPoint.x),
    y: Math.min(Math.max(point.y, lowerPoint.y), higherPoint.y)
});

function SmoothVolumeChart({top, left, width, height, pointCount, maxPossibleAmount}) {

    const xScale = scaleLinear({range: [0, width], domain: [0, maxPossibleAmount]});
    const yScale = scaleLinear({range: [height, 0], domain: [0, 100]});

    let [middlePoint, setMiddlePoint] = useState({
        x: maxPossibleAmount * 0.25,
        y: 50
    });

    let [upperMiddlePoint, setUpperMiddlePoint] = useState({
        x: maxPossibleAmount * 0.75,
        y: 50
    });

    const [minAmount, setMinAmount] = useState(10);
    let [minPoint, setMinPoint] = useState({x: minAmount, y: fun(minAmount)});
    useEffect(() => setMinPoint(setWithLimit({x: minAmount, y: fun(minAmount)}, {x: 0, y: 0}, middlePoint)), [minAmount, middlePoint]);

    const [maxAmount, setMaxAmount] = useState(maxPossibleAmount-10);
    let [maxPoint, setMaxPoint] = useState({x: maxAmount, y: fun(maxAmount)});
    useEffect(() => setMaxPoint(setWithLimit({x: maxAmount, y: fun(maxAmount)}, upperMiddlePoint)), [maxAmount, upperMiddlePoint]);

    const [points, setPoints] = useState([minPoint, middlePoint, upperMiddlePoint, maxPoint]);
    useEffect(() => setPoints([minPoint, middlePoint, upperMiddlePoint, maxPoint]), [setPoints, minPoint, maxPoint, middlePoint, upperMiddlePoint]);


    const funLimited = (x) => x < minAmount ? 0 : Math.max(Math.min(fun(x), maxPoint.y), 0);
    // const interpolateLimited = (x) => x < minAmount ? 0 : (x > maxAmount ? maxPoint.y : (Math.max(Math.min(interpolate(points, x), maxPoint.y), minPoint.y)));
    const interpolateLimited = (x) => {
        const closestPoint = Array.of(...points).reverse().find(d => d.x < x) ?? {y: 0};
        return x < minAmount ? 0 : Math.min(Math.max(interpolate(points, x), closestPoint.y), maxPoint.y);
    };

    const dn = maxPossibleAmount / pointCount;
    const data = Array.from({length: pointCount}, (x, i) => ({x: i * dn, y: funLimited(i * dn)}));
    const data2 = Array.from({length: pointCount}, (x, i) => ({x: i * dn, y: interpolateLimited(i*dn)}));


    // -----

    const lines = [];
    for (let i = 0; i < points.length - 1; i++) {
        const one = points[i];
        const two = points[i+1];
        const line = (
            <Line
                key={`line-${i}`}
                from={{x: xScale(one.x)+left, y: yScale(one.y)+top}}
                to={{x: xScale(two.x)+left, y: yScale(two.y)+top}}
                stroke={"#0f0"}
            />);
        lines.push(line);
    }



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

                <LinePath
                    curve={curveLinear}
                    data={data2}
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
                value={xScale(maxPoint.x)+left}
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
                value={{x: xScale(middlePoint.x)+left, y: yScale(middlePoint.y)+top}}
                onDrag={(c) => setMiddlePoint(setWithLimit( {
                    x: xScale.invert(c.x + c.dx - left),
                    y: yScale.invert(c.y + c.dy - top)
                }, minPoint, upperMiddlePoint))}
            />

            <PointAdjuster
                top={top}
                left={left}
                width={width}
                height={height}
                value={{x: xScale(upperMiddlePoint.x)+left, y: yScale(upperMiddlePoint.y)+top}}
                onDrag={(c) => setUpperMiddlePoint(setWithLimit( {
                    x: xScale.invert(c.x + c.dx - left),
                    y: yScale.invert(c.y + c.dy - top)
                }, middlePoint, maxPoint))}
            />

            {lines}
        </>
    );
}

export default SmoothVolumeChart;
