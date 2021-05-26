import React, {useEffect, useState} from 'react';
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import {PointAdjuster, VolumeGrid} from "../components";
import Container from "react-bootstrap/Container";
import FormGroup from "react-bootstrap/FormGroup";
import Form from "react-bootstrap/Form";
import {scaleLinear} from "@visx/scale";
import {interpolateLimited} from "../utils/function";
import {LinePath, Line} from "@visx/shape";
import {curveLinear} from "@visx/curve";
import {update, setWithLimit, pointsToString} from "../utils/utils";

function EditSmoothVolumeDiscountPage() {

    const [pointCount, setPointCount] = useState(2);
    const maxAmount = 100;
    const maxDiscount = 1;
    const N = 500;

    const width = 800;
    const height = 400;

    const padding = {x: 50, y: 50};
    const innerWidth = width - 2 * padding.x;
    const innerHeight = height - 2 * padding.y;

    const xScale = scaleLinear({range: [0, innerWidth], domain: [0, maxAmount]});
    const yScale = scaleLinear({range: [innerHeight, 0], domain: [0, maxDiscount]});

    const pointA = {x: 10, y: 0.1};
    const pointB = {x: maxAmount-10, y: maxDiscount-0.1};

    const generatePoints = (count) => Array.from({length: count}, (x, i) => ({
        x: maxAmount / (count + 1) * (i + 1),
        y: maxDiscount / (count + 1) * (i + 1)
    }));

    const [points, setPoints] = useState(generatePoints(pointCount));
    useEffect(() => setPoints(generatePoints(pointCount)), [pointCount]);

    const getRatio = (point, minPoint, maxPoint) => ({
        x: (point.x - minPoint.x) / (maxPoint.x - minPoint.x),
        y: (point.y - minPoint.y) / (maxPoint.y - minPoint.y)
    });

    const [ratioPoints, setRatioPoints] = useState(points.map(item => getRatio(item, pointA, pointB)));
    useEffect(() => setRatioPoints(points.map(item => getRatio(item, pointA, pointB))), [points]);

    useEffect(() => console.log(points), [points])

    const dn = maxAmount / N;
    const data = Array.from({length: N}, (x, i) => ({x: i * dn, y: x < pointA.x ? 0 : (x > pointB.x ? pointB.y : interpolateLimited([].concat(pointA, ...points, pointB), i * dn))}));

    const adjusters = [];
    for (let i = 0; i < points.length; i++) {
        const adjuster = (
            <PointAdjuster
                key={`adjuster-${i}`}
                top={padding.y}
                left={padding.x}
                width={innerWidth}
                height={innerHeight}
                value={{x: xScale(points[i].x) + padding.x, y: yScale(points[i].y) + padding.y}}
                onDrag={(c) => setPoints(
                    update(points, i,
                        setWithLimit({
                                x: xScale.invert(c.x + c.dx - padding.x),
                                y: yScale.invert(c.y + c.dy - padding.y)
                            },
                            i < 1 ? {x: pointA.x + 1, y: pointA.y} : {x: points[i - 1].x + 1, y: points[i - 1].y + 0.01},
                            i >= points.length - 1 ? {x: pointB.x - 1, y: pointB.y} : {
                                x: points[i + 1].x - 1,
                                y: points[i + 1].y - 0.01
                            })
                    )
                )}
            />
        );
        adjusters.push(adjuster);
    }

    return (
        <>
            <Container fluid="xl" className="p-2">
                <FormGroup as={Row}>
                    <Form.Label column sm={2}>
                        Point Count
                    </Form.Label>
                    <Col>
                        <Form.Control value={pointCount} onChange={event => setPointCount(event.target.value.replace(/\D/,''))}/>
                    </Col>
                </FormGroup>
                <Row className="mt-2">
                    <Col>
                        <center>
                            <svg width={width} height={height}>
                                <rect x={0} y={0} width={width} height={height} fill="#fff" rx={4} ry={4}>
                                </rect>

                                <VolumeGrid
                                    top={padding.y}
                                    left={padding.x}
                                    width={innerWidth}
                                    height={innerHeight}
                                    maxX={maxAmount}
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
                                </g>

                                {adjusters}

                                <Line
                                    from={{x: xScale(pointA.x)+padding.x, y:yScale(pointA.y)+padding.y}}
                                    to={{x: xScale(pointA.x)+padding.x, y:yScale(pointB.y)+padding.y}}
                                    stroke="#f00"
                                />
                                <Line
                                    from={{x: xScale(pointA.x)+padding.x, y:yScale(pointA.y)+padding.y}}
                                    to={{x: xScale(pointB.x)+padding.x, y:yScale(pointA.y)+padding.y}}
                                    stroke="#f00"
                                />
                                <Line
                                    from={{x: xScale(pointB.x)+padding.x, y:yScale(pointB.y)+padding.y}}
                                    to={{x: xScale(pointA.x)+padding.x, y:yScale(pointB.y)+padding.y}}
                                    stroke="#f00"
                                />
                                <Line
                                    from={{x: xScale(pointB.x)+padding.x, y:yScale(pointB.y)+padding.y}}
                                    to={{x: xScale(pointB.x)+padding.x, y:yScale(pointA.y)+padding.y}}
                                    stroke="#f00"
                                />
                            </svg>
                        </center>
                    </Col>
                </Row>
                <FormGroup as={Row} className="mt-2">
                    <Col>
                        <Form.Control type="text" value={pointsToString(ratioPoints)} readOnly />
                    </Col>
                </FormGroup>
            </Container>
        </>
    );
}

export default EditSmoothVolumeDiscountPage;