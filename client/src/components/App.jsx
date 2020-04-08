import * as React from "react";
import Header from "./Header";
import Content from "./Content";
import Footer from "./Footer";
import {Container} from "react-bootstrap";
import Col from "react-bootstrap/Col";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import {AIRPORT_LIMIT} from "./MainMap";

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            showModal: false,
        };

        this.setShow = this.setShow.bind(this);
        this.renderModal = this.renderModal.bind(this);
    }

    setShow(show) {
        this.setState({
            showModal: show,
        });
    }

    renderModal() {
        if (this.state.showModal) {
            return (<Modal show={true} onHide={() => this.setShow(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>About</Modal.Title>
                </Modal.Header>
                <Modal.Body>AirMap is a web application aimed at aviation enthusiasts that want to see the busiest airports from 2019 (by aircraft movements) on a world map.</Modal.Body>
                <Modal.Body>This application has two modes: summary mode, and detailed mode. Source code can be found <a href={"https://github.com/kilowatt-/AirMap"}>here</a>.</Modal.Body>
                <Modal.Header>
                    <Modal.Title>Summary mode</Modal.Title>
                </Modal.Header>
                <Modal.Body>This mode is the application's default mode.
                    In this mode, no airport is selected, and the {AIRPORT_LIMIT} busiest visible airports are shown as proportional circles. Circle radii are proportional
                    to the number of departures from that airport.
                </Modal.Body>
                <Modal.Body>
                    Data is sourced from the <a href={"https://www.icao.int/safety/iStars/Pages/API-Data-Service.aspx"}>ICAO iSTARS API Data Service.</a>
                </Modal.Body>

                <Modal.Header>
                    <Modal.Title>Detailed mode</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    This mode is set when an airport is selected from summary mode.
                </Modal.Body>
                <Modal.Body>
                    In this mode, detailed airport data will show up on the sidebar.
                </Modal.Body>

                <Modal.Body>
                    <b>If available</b>, the application show a list of estimated weekly departures by route. This data originates from <a href={"https://opensky-network.org/"}>OpenSky Network</a>.
                    The accuracy of this data is limited, as I am using departures from the week of <b>December 15, 2019</b> to plot these estimates.
                </Modal.Body>
                <Modal.Body>
                    The busiest routes will then be shown in a table, and their corresponding airports plotted on the map as proportional circles.
                </Modal.Body>

                <Modal.Body>
                    To return to summarised mode, click on any non-marked location on the map.
                </Modal.Body>

                <Modal.Footer>
                    <Button variant="primary" onClick={() => this.setShow(false)} >
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>)
        } else {
            return <></>;
        }
    }

    render() {
        return (
            <>
                <Container fluid style={{ paddingLeft: 0, paddingRight: 0, marginLeft: 0}}>
                    <Col style={{flex: 0.1, flexDirection: "column", paddingLeft: 0, paddingRight: 0, marginLeft: 0}}> <Header showModal={this.state.showModal} modalCallback={this.setShow} /></Col>
                    <Col style={{flex: 0.80, flexDirection: "column", paddingLeft: 0, paddingRight: 0, marginLeft: 0}}>  <Content /></Col>
                    <Col style={{flex: 0.1, flexDirection: "column", paddingLeft: 0, paddingRight: 0, marginLeft: 0}}> <Footer /></Col>
                </Container>

                {this.renderModal()}

            </>


        );
    }
}

export default App;
