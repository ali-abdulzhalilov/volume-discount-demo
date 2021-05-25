import React, {useEffect, useState} from 'react';
import {Line, LinePath} from "@visx/shape";
import {curveLinear} from "@visx/curve";
import {scaleLinear} from '@visx/scale';
import {PointAdjuster} from "../components";

const interpolate = (points, x) => {
    let res = 0;

    for (let i = 0; i < points.length; i++) {
        let term = points[i].y;

        for (let j = 0; j < points.length; j++) {
            if (j !== i) {
                term = term * (x - points[j].x) / (points[i].x - points[j].x);
            }
        }

        res += term;
    }

    return res;
}

const update = (arr, ind, val) => [...arr.slice(0, ind), val, ...arr.slice(ind + 1, arr.length)];

const setWithLimit = (point, lowerPoint = point, higherPoint = point) => ({
    x: Math.min(Math.max(point.x, lowerPoint.x), higherPoint.x),
    y: Math.min(Math.max(point.y, lowerPoint.y), higherPoint.y)
});

function SmoothVolumeChart({top, left, width, height, pointCount, maxPossibleAmount}) {

    const xScale = scaleLinear({range: [0, width], domain: [0, maxPossibleAmount]});
    const yScale = scaleLinear({range: [height, 0], domain: [0, 100]});

    const [pointA, setPointA] = useState({x: 0, y: 0});
    const [pointB, setPointB] = useState({x: 100, y: 100});

    const N = 2;
    const [points, setPoints] = useState([
        pointA,
        ...Array.from({length: N}, (x, i) => ({
            x: 100 / (N + 1) * (i + 1),
            y: 100 / (N + 1) * (i + 1)
        })),
        pointB]);
    useEffect(() => setPointA(points[0]), [points]);
    useEffect(() => setPointB(points[points.length-1]), [points]);

    const interpolateLimited = (x) => {
        let y = interpolate(points, x);

        const closestPointRight = Array.of(...points).reverse().find(d => d.x < x) ?? {y: 0};
        const closestPointLeft = Array.of(...points).find(d => d.x > x) ?? {y: interpolate(points, x)};

        y = Math.min(Math.max(y, closestPointRight.y), closestPointLeft.y)

        const firstPoint = pointA;
        const lastPoint = pointB;

        y = x < firstPoint.x ? 0 : (x > lastPoint.x ? lastPoint.y : y);

        return y;
    };

    const dn = maxPossibleAmount / pointCount;
    const data = Array.from({length: pointCount}, (x, i) => ({x: i * dn, y: interpolateLimited(i * dn)}));


    // -----

    const lines = [];
    for (let i = 0; i < points.length - 1; i++) {
        const one = points[i];
        const two = points[i + 1];
        const line = (
            <Line
                key={`line-${i}`}
                from={{x: xScale(one.x) + left, y: yScale(one.y) + top}}
                to={{x: xScale(two.x) + left, y: yScale(two.y) + top}}
                stroke={"#0f0"}
            />);
        lines.push(line);
    }

    const adjusters = [];
    for (let i = 0; i < points.length; i++) {
        const adjuster = (
            <PointAdjuster
                top={top}
                left={left}
                width={width}
                height={height}
                value={{x: xScale(points[i].x) + left, y: yScale(points[i].y) + top}}
                onDrag={(c) => setPoints(
                    update(points, i,
                        setWithLimit({
                                x: xScale.invert(c.x + c.dx - left),
                                y: yScale.invert(c.y + c.dy - top)
                            },
                            i < 1 ? {x: 0, y: 0} : {x: points[i - 1].x + 1, y: points[i - 1].y + 0.01},
                            i >= points.length - 1 ? {x: points[i].x + 100, y: 100} : {
                                x: points[i + 1].x - 1,
                                y: points[i + 1].y - 0.01
                            })
                    )
                )}
            />
        );
        adjusters.push(adjuster);
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
            </g>

            {adjusters}

            {lines}
        </>
    );
}

export default SmoothVolumeChart;
