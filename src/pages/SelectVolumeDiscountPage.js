import React, {useEffect, useState} from 'react';
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import {VolumeGrid} from "../components";
import Container from "react-bootstrap/Container";
import {Line, LinePath} from "@visx/shape";
import {curveLinear} from "@visx/curve";
import {scaleLinear} from "@visx/scale";
import {interpolateLimited} from "../utils/function";
import FormGroup from "react-bootstrap/FormGroup";
import Form from "react-bootstrap/Form";
import {pointsToString} from "../utils/utils";

const ratioPoints = [
    [{x: 0.065, y: 0.125}],
    [{x: 0.22, y: 0.5375}, {x: 0.54, y: 0.9}],
    [{x:0.056, y:0.25},{x:0.453, y:0.963},{x:0.897, y:1}],
    [{x: 0.25, y: 0.075}],
    [{x: 0.622, y: 0.179}, {x: 0.913, y: 0.729}],
    [{x:0.342, y:0.008},{x:0.772, y:0.275},{x:0.942, y:0.746}]
];

function SelectVolumeDiscountPage() {

    const N = 250;
    const width = 800;
    const height = 400;
    const padding = {x: 50, y: 50};
    const innerWidth = width - 2 * padding.x;
    const innerHeight = height - 2 * padding.y;

    const absoluteLimits = {min: {x: 1, y: 0.1}, max: {y: 0.9}};

    const [minPoint, setMinPoint] = useState({x: 10, y: absoluteLimits.min.y});
    const [maxPoint, setMaxPoint] = useState({x: 90, y: absoluteLimits.max.y});

    const xScale = scaleLinear({range: [0, innerWidth], domain: [0, maxPoint.x + maxPoint.x * 0.1]});
    const yScale = scaleLinear({range: [innerHeight, 0], domain: [0, 1]});

    const [selectedRatioPointsIndex, setSelectedRatioPointsIndex] = useState(0);

    const calculatePoints = (ratioPoints, minPoint, maxPoint) => ratioPoints.map(ratio => ({
        x: (maxPoint.x - minPoint.x) * ratio.x + minPoint.x,
        y: (maxPoint.y - minPoint.y) * ratio.y + minPoint.y
    }));
    const [points, setPoints] = useState(calculatePoints(ratioPoints[selectedRatioPointsIndex], minPoint, maxPoint));
    useEffect(() => setPoints(calculatePoints(ratioPoints[selectedRatioPointsIndex], minPoint, maxPoint)), [selectedRatioPointsIndex, minPoint, maxPoint]);

    const dn = maxPoint.x / N;
    const data = Array.from({length: N}, (x, i) => ({
        x: i * dn,
        y: interpolateLimited([].concat(minPoint, ...points, maxPoint), i * dn)
    }));

    const [tooltipData, setTooltipData] = useState({top: 0, left: 0, isOpen:false, data: {discountPercent: 0, amount: 0, discount: 0}});

    const handleMouseMove = (event) => {
        console.log(event);
        console.log('{x:'+(event.screenX-event.clientX)+' y:'+(event.screenY-event.clientY)+'}');
    }
    const handleMouseLeave = () => setTooltipData(Object.assign(
        {},
        tooltipData,
        {
            timeout: window.setTimeout(
                () => setTooltipData(Object.assign(
                    {},
                    tooltipData,
                    {isOpen: false})),
                300)
        }
    ));

    return (
        <>
            <Container fluid="xl">
                <Row className="mt-2">
                    <Col>
                        <center>
                            <svg width={width} height={height}>
                                <rect
                                    x={0} y={0}
                                    width={width} height={height}
                                    fill="#fff"
                                    rx={4} ry={4}
                                    onMouseMove={handleMouseMove}
                                    onMouseLeave={handleMouseLeave}
                                >
                                </rect>

                                <VolumeGrid
                                    top={padding.y}
                                    left={padding.x}
                                    width={innerWidth}
                                    height={innerHeight}
                                    maxX={maxPoint.x + maxPoint.x * 0.1}
                                />

                                <g transform={`translate(${padding.x},${padding.y})`}>
                                    <LinePath
                                        curve={curveLinear}
                                        data={data}
                                        x={(d) => xScale(d.x) ?? 0}
                                        y={(d) => yScale(d.y) ?? 0}
                                        strokeWidth={2}
                                        stroke="#000"
                                    />
                                    <Line
                                        from={{x: xScale(maxPoint.x), y: yScale(maxPoint.y)}}
                                        to={{x: xScale(maxPoint.x) + xScale(maxPoint.x * 0.1), y: yScale(maxPoint.y)}}
                                        strokeWidth={2}
                                        stroke="#000"
                                    />
                                </g>

                                <Line
                                    from={{x: xScale(minPoint.x) + padding.x, y: yScale(minPoint.y) + padding.y}}
                                    to={{x: xScale(minPoint.x) + padding.x, y: yScale(maxPoint.y) + padding.y}}
                                    stroke="#f00"
                                />
                                <Line
                                    from={{x: xScale(minPoint.x) + padding.x, y: yScale(minPoint.y) + padding.y}}
                                    to={{x: xScale(maxPoint.x) + padding.x, y: yScale(minPoint.y) + padding.y}}
                                    stroke="#f00"
                                />
                                <Line
                                    from={{x: xScale(maxPoint.x) + padding.x, y: yScale(maxPoint.y) + padding.y}}
                                    to={{x: xScale(minPoint.x) + padding.x, y: yScale(maxPoint.y) + padding.y}}
                                    stroke="#f00"
                                />
                                <Line
                                    from={{x: xScale(maxPoint.x) + padding.x, y: yScale(maxPoint.y) + padding.y}}
                                    to={{x: xScale(maxPoint.x) + padding.x, y: yScale(minPoint.y) + padding.y}}
                                    stroke="#f00"
                                />
                            </svg>
                        </center>
                    </Col>
                </Row>

                {/* ----- */}

                <FormGroup as={Row} className="mt-2">
                    <Col>
                        <Form.Control type="text" placeholder="X1" value={minPoint.x} onChange={event => setMinPoint({
                            x: event.target.value.replace(/\D/, '') * 1,
                            y: minPoint.y
                        })}/>
                    </Col>
                    <Col xs={6}>
                        <Form.Control className="w-100" type="range" min={absoluteLimits.min.y}
                                      max={Math.min(maxPoint.y, absoluteLimits.max.y)} step="0.01" placeholder="Y1"
                                      value={minPoint.y} onChange={event => setMinPoint({
                            x: minPoint.x,
                            y: event.target.value.replace(/\.\D/, '') * 1
                        })}/>
                    </Col>
                </FormGroup>
                <FormGroup as={Row} className="mt-2">
                    <Col>
                        <Form.Control type="text" placeholder="X1" value={maxPoint.x} onChange={event => setMaxPoint({
                            x: event.target.value.replace(/\D/, '') * 1,
                            y: maxPoint.y
                        })}/>
                    </Col>
                    <Col xs={6}>
                        <Form.Control className="w-100" type="range" min={Math.max(minPoint.y, absoluteLimits.min.y)}
                                      max={absoluteLimits.max.y} step="0.01" placeholder="Y1" value={maxPoint.y}
                                      onChange={event => setMaxPoint({
                                          x: maxPoint.x,
                                          y: event.target.value.replace(/\.\D/, '') * 1
                                      })}/>
                    </Col>
                </FormGroup>

                {/* ----- */}

                <FormGroup as={Row} className="my-2">
                    <Form.Control as="select" value={selectedRatioPointsIndex}
                                  onChange={event => setSelectedRatioPointsIndex(event.target.value)}>
                        {ratioPoints.map((item, index) => (
                            <option key={`option-${index}`}
                                    value={index}
                            >
                                {pointsToString(ratioPoints[index])}
                            </option>
                        ))}
                    </Form.Control>
                </FormGroup>

            </Container>
        </>
    );
}

export default SelectVolumeDiscountPage;