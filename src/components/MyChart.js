import React, {useEffect, useRef, useState} from 'react';
import {SmoothVolumeChart} from "../components";

function MyChart() {

    const ref = useRef(null);

    const [width, setWidth] = useState(ref.current ? ref.current.offsetWidth : 0);
    useEffect(() => {
        const handleResize = () => {
            setWidth(ref.current ? ref.current.offsetWidth : 0)
        }

        window.addEventListener('resize', handleResize)

        return () => {
            window.removeEventListener('resize', handleResize)
        }
    }, [ref]);

    // const width = 500;
    const height = 500;
    const padding = {x: 50, y: 50};
    const innerWidth = width - 2 * padding.x;
    const innerHeight = height - 2 * padding.y;


    const N = 300;
    const maxAmount = 100;

    return (
        <div ref={ref}>
            <svg width={width} height={height}>
                <rect x={0} y={0} width={width} height={height} fill="#fff" rx={4} ry={4}>
                </rect>
                <SmoothVolumeChart
                    top={padding.y}
                    left={padding.x}
                    width={innerWidth}
                    height={innerHeight}
                    pointCount={N}
                    maxPossibleAmount={maxAmount}
                />
            </svg>
        </div>
    );
}

export default MyChart;
