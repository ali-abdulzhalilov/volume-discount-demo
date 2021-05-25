import React from 'react';
import {Drag} from "@visx/drag";

const radius = 5;

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
                    {({dragStart, dragEnd, dragMove, isDragging}) => (
                        <>
                            <circle
                                cx={value.x-left}
                                cy={value.y-top}
                                r={isDragging ? radius + 4 : radius}
                                fill={'transparent'}
                                stroke={'#f00'}
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