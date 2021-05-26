import React from 'react';
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import {MyChart} from "../components";
import Container from "react-bootstrap/Container";

function SelectVolumeDiscountPage() {
    return (
        <>
            <Container fluid="xl">
                <Row>
                    <Col sm={12} md={6} className={"p-3"}>
                        <MyChart/>
                    </Col>
                    <Col>
                        hmm
                    </Col>
                </Row>
            </Container>
        </>
    );
}

export default SelectVolumeDiscountPage;