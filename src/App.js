import './static/App.css';
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link
} from "react-router-dom";
import {SelectVolumeDiscountPage, EditSmoothVolumeDiscountPage} from "./pages";
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

function App() {
    return (
        <Router>
            <Navbar bg="dark" className="px-4">
                <Navbar.Brand className="text-white">
                    <span className="fw-bold text-danger">KE</span>.VolumeDiscount
                </Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav" className="">
                    <Nav className="mr-auto">
                        <Nav.Item>
                            <Link className="text-decoration-none text-muted px-2" to="/">Select</Link>
                        </Nav.Item>
                        <Nav.Item>
                            <Link className="text-decoration-none text-muted" to="/edit">Edit</Link>
                        </Nav.Item>
                    </Nav>
                </Navbar.Collapse>
            </Navbar>
            <Switch>
                <Route exact path="/">
                    <SelectVolumeDiscountPage />
                </Route>
                <Route exact path="/edit">
                    <EditSmoothVolumeDiscountPage />
                </Route>
                <Route>
                    <Container>
                        <Row>
                            <Col>
                                <h1>
                                    404
                                </h1>
                            </Col>
                        </Row>
                    </Container>
                </Route>
            </Switch>
        </Router>
    );
}

export default App;
