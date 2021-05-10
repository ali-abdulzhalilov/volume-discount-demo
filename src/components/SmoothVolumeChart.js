import React from 'react';
import {LinePath, Line} from "@visx/shape";
import {curveLinear} from "@visx/curve";
import {scaleLinear} from '@visx/scale';
import {useDrag} from '@visx/drag';

function SmoothVolumeChart({top, left, width, height, pointCount, maxAmount}) {

    const poly = (a, b, c, n, x) => a * Math.pow(x + b, n) + c;

    const fun = (x) => poly(0.01, 0, 0, 2, x);

    const max = {x: 70, y: fun(70)};
    const funWithLimit = (x) => Math.min(fun(x), max.y);

    const dn = maxAmount/pointCount;
    const data = Array.from({length: pointCount}, (x, i) => ({x: i*dn, y: funWithLimit(i*dn)}));

    const getX = (d) => d.x;
    const getY = (d) => d.y;

    const xScale = scaleLinear({range: [0, width], domain: [0, maxAmount]});
    const yScale = scaleLinear({range: [height, 0], domain: [0, 100]});

    const getScaledX = (d) => xScale(getX(d)) ?? 0;
    const getScaledY = (d) => yScale(getY(d)) ?? 0;

    // -----

    const onDragStart = c => console.log(c);
    const onDragEnd = c => console.log(c);
    const onDragMove = c => console.log(c);

    const { x = 0, isDragging, dx, dragStart, dragEnd, dragMove } = useDrag({
        x: xScale(50),
        onDragStart,
        onDragMove,
        onDragEnd,
        resetOnStart: true,
    });

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

                <Line
                    from={{x: xScale(max.x), y: 0}}
                    to={{x: xScale(max.x), y: height}}
                    stroke="#f66"
                    strokeWidth={2}
                    pointerEvents="none"
                />
            </g>

            <rect
                x={x-50}
                y={top}
                width={100}
                height={height}
                onMouseDown={dragStart}
                onMouseMove={dragMove}
                onMouseUp={dragEnd}
                fill="transparent"
            />
            <Line
                from={{x: x, y: top}}
                to={{x: x, y: top+height}}
                stroke="#f66"
                strokeWidth={isDragging ? 2 : 1}
                transform={`translate(${dx}, 0)`}
            />

        </>
    );
}

export default SmoothVolumeChart;
