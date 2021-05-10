import React from 'react';
import {Drag} from "@visx/drag";

const radius = 10;

function PointAdjuster({top, left, width, height, value, onDrag}) {
    return (
        <>
            <g transform={`translate(${left},${top})`}>
                <Drag
                    x={value.x}
                    y={value.y}
                    width={width}
                    height={height}
                    onDragStart={onDrag}
                    onDragMove={onDrag}
                    onDragEnd={onDrag}
                >
                    {({dragStart, dragEnd, dragMove, isDragging, x, y, dx, dy}) => (
                        <>
                            <circle
                                cx={x-left}
                                cy={y-top}
                                r={radius}
                                fill={"transparent"}
                                transform={`translate(${dx}, ${dy})`}
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
                            <circle
                                cx={value.x-left}
                                cy={value.y-top}
                                r={isDragging ? 2 : 1}
                                fill={'#f00'}
                                onMouseMove={dragMove}
                                onMouseUp={dragEnd}
                                onMouseDown={dragStart}
                                onTouchStart={dragStart}
                                onTouchMove={dragMove}
                                onTouchEnd={dragEnd}
                            />
                        </>
                    )}
                </Drag>
            </g>
        </>
    );
}

export default PointAdjuster;