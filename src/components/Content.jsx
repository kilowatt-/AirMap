import * as React from "react";
import "./style.css"
import {Container} from "react-bootstrap";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import 'leaflet/dist/leaflet.css';
import MainMap from "./MainMap";
import AirportDetails from "./AirportDetails";

class Content extends React.Component {
    render() {
        return (
            <Container fluid style={{ paddingLeft: 0, paddingRight: 0, marginRight: 0, height: "100%" }}>
                <Row>
                    <Col xs={2} xl={2} style={{paddingRight: 0 }}><AirportDetails /></Col>
                    <Col xs={10} xl={10} style={{paddingLeft: 0, marginLeft: 0, width: "100%", height: "100vh"}}>
                        <MainMap />
                    </Col>
                </Row>
            </Container>
        )
    }
}

export default Content;
