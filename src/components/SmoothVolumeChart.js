import React, {useEffect, useState, useCallback} from 'react';
import {LinePath, Line} from "@visx/shape";
import {curveLinear} from "@visx/curve";
import {scaleLinear} from '@visx/scale';
import {Drag} from '@visx/drag';

function SmoothVolumeChart({top, left, width, height, pointCount, maxAmount}) {

    const poly = (a, b, c, n, x) => a * Math.pow(x + b, n) + c;
    const fun = useCallback((x) => poly(0.01, 0, 0, 1.9, x), []);

    const [maxX, setMaxX] = useState(70);
    const [maxY, setMaxY] = useState(fun(maxX));
    useEffect(() => {setMaxY(fun(maxX))}, [fun, maxX]);
    const funWithLimit = (x) => Math.min(fun(x), maxY);

    const dn = maxAmount/pointCount;
    const data = Array.from({length: pointCount}, (x, i) => ({x: i*dn, y: funWithLimit(i*dn)}));

    const getX = (d) => d.x;
    const getY = (d) => d.y;

    const xScale = scaleLinear({range: [0, width], domain: [0, maxAmount]});
    const yScale = scaleLinear({range: [height, 0], domain: [0, 100]});

    const getScaledX = (d) => xScale(getX(d)) ?? 0;
    const getScaledY = (d) => yScale(getY(d)) ?? 0;

    // -----

    const [xx, setXX] = useState(xScale(maxX)+left);
    const [isDragging, setIsDragging] = useState(false);
    const getValue = (value) => value/width*maxAmount;

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

                <Drag
                    x={xScale(maxX)+left}
                    y={0}
                    width={width}
                    height={height}
                    onDragStart={onDrag}
                    onDragMove={onDrag}
                    onDragEnd={onDrag}
                >
                    {({ dragStart, dragEnd, dragMove, isDragging, x, dx }) => (
                        <rect
                            key={`dot-single`}
                            x={x-5-left}
                            y={0}
                            width={10}
                            height={height}
                            fill={"transparent"}
                            transform={`translate(${dx}, 0)`}
                            fillOpacity={0.9}
                            stroke={isDragging ? "transparent" : "#eee"}
                            strokeWidth={1}
                            onMouseMove={dragMove}
                            onMouseUp={dragEnd}
                            onMouseDown={dragStart}
                            onTouchStart={dragStart}
                            onTouchMove={dragMove}
                            onTouchEnd={dragEnd}
                        />
                    )}
                </Drag>

                <Line
                    from={{x: xx-left, y: 0}}
                    to={{x: xx-left, y: height}}
                    stroke="#f66"
                    strokeWidth={isDragging ? 2 : 1}
                    pointerEvents="none"
                />
            </g>
        </>
    );
}

export default SmoothVolumeChart;
