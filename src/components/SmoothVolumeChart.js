import React, {useEffect, useState} from 'react';
import {LinePath} from "@visx/shape";
import {curveLinear} from "@visx/curve";
import {scaleLinear} from '@visx/scale';
import {PointAdjuster, VolumeGrid} from "../components";
import {interpolateLimited} from "../utils/function";
import {update, setWithLimit} from "../utils/utils";

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

    const dn = maxPossibleAmount / pointCount;
    const data = Array.from({length: pointCount}, (x, i) => ({x: i * dn, y: interpolateLimited(points, i * dn)}));

    // -----

    const adjusters = [];
    for (let i = 0; i < points.length; i++) {
        const adjuster = (
            <PointAdjuster
                key={`adjuster-${i}`}
                top={top}
                left={left}
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
            <VolumeGrid
                top={top}
                left={left}
                width={width}
                height={height}
                maxX={maxPossibleAmount}
            />

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
        </>
    );
}

export default SmoothVolumeChart;
