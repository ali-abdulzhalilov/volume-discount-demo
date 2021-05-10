import React, {useState} from 'react';
import {Drag} from "@visx/drag";
import {Line} from "@visx/shape";

function HorizontalSlider({top, left, width, height, value, onDrag}) {
    const [isDragging, setIsDragging] = useState(false);
    const onDragWrapper = (c) => {setIsDragging(c.isDragging); onDrag(c);}

    return (
        <>
            <g transform={`translate(${left},${top})`}>
                <Drag
                    x={value}
                    y={0}
                    width={width}
                    height={height}
                    onDragStart={onDragWrapper}
                    onDragMove={onDragWrapper}
                    onDragEnd={onDragWrapper}
                >
                    {({dragStart, dragEnd, dragMove, isDragging, x, dx}) => (
                        <rect
                            key={`dot-single`}
                            x={x - 5 - left}
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
                    from={{x: value - left, y: 0}}
                    to={{x: value - left, y: height}}
                    stroke="#f66"
                    strokeWidth={isDragging ? 2 : 1}
                    pointerEvents="none"
                />
            </g>
        </>
    );
}

export default HorizontalSlider;