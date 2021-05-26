import './static/App.css';
import {MyChart} from "./components";
import Container from 'react-bootstrap/Container';
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Navbar from "react-bootstrap/Navbar";

function App() {
    return (
        <>
            <Navbar bg="dark" className="px-4">
                <Navbar.Brand className={"text-white"}>
                    <span className="fw-bold text-danger">KE</span>.VolumeDiscount
                </Navbar.Brand>
            </Navbar>
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

export default App;
