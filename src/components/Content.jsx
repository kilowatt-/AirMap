import * as React from "react";
import "./style.css"
import {Container} from "react-bootstrap";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import 'leaflet/dist/leaflet.css';
import { Map, Marker, Popup, TileLayer } from 'react-leaflet'

const position = [51.505, -0.09];

class Content extends React.Component {
    render() {
        return (

            <Container fluid style={{ paddingLeft: 0, paddingRight: 0, marginRight: 0, height: "100%" }}>

                <Row>
                    <Col style={{paddingRight: 0 }}><div class={"sidebar"}>Click on an airport for more information</div></Col>
                    <Col xs={10} style={{paddingLeft: 0, marginLeft: 0, width: "100%", height: "100vh"}}>
                        <Map center={position} zoom={13}>
                            <TileLayer
                                attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                                url="https://{s}.tile.osm.org/{z}/{x}/{y}.png"
                            />
                        </Map>
                    </Col>
                </Row>
            </Container>
        )
    }
}

export default Content;
