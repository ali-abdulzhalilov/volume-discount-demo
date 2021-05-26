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
                    // onDragMove={onDrag}
                    onDragEnd={onDrag}
                >
                    {({dragStart, dragEnd, dragMove, dx, dy, isDragging}) => (
                        <>
                            <circle
                                cx={value.x-left}
                                cy={value.y-top}
                                r={isDragging ? radius + 3 : radius}
                                fill={'transparent'}
                                stroke={'#f00'}
                                transform={`translate(${dx}, ${dy})`}
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