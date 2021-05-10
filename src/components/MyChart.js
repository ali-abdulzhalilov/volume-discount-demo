import React from 'react';
import {SmoothVolumeChart, VolumeGrid} from "../components";

function MyChart({width, height}) {

    const padding = {x: 50, y: 30};
    const innerWidth = width - 2 * padding.x;
    const innerHeight = height - 2 * padding.y;

    const N = 500;

    return (
        <>
            <svg width={width} height={height}>
                <rect x={0} y={0} width={width} height={height} fill="#fff" rx={4} ry={4}>
                </rect>
                <SmoothVolumeChart
                    top={padding.y}
                    left={padding.x}
                    width={innerWidth}
                    height={innerHeight}
                    N={N}
                />
                <VolumeGrid
                    top={padding.y}
                    left={padding.x}
                    width={innerWidth}
                    height={innerHeight}
                    maxX={N}
                />
            </svg>
        </>
    );
}

export default MyChart;