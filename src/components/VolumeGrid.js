import React from 'react';
import {AxisBottom, AxisLeft} from '@visx/axis';
import {scaleLinear} from "@visx/scale";

function VolumeGrid({top, left, width, height, maxX}) {

    const xScale = scaleLinear({domain: [0, maxX], range:[0, width]})
    const yScale = scaleLinear({domain: [0, 100], range:[height, 0]})

    return (
        <>
            <AxisLeft
                scale={yScale}
                key={`axis-left`}
                top={top}
                left={left}
                label={"%"}
                labelOffset={20}
            />
            <AxisBottom
                scale={xScale}
                key={`axis-bottom`}
                top={height+top}
                left={left}
            />
        </>
    )
}

export default VolumeGrid;