import * as React from "react";
import {setActiveAirport, unsetActiveAirport} from "../controller/actions";
import {connect} from "react-redux";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import RouteDetailTable from "./RouteDetailTable";

class AirportDetails extends React.Component {
    constructor(props) {
        super(props);

        this.renderAirportDetails = this.renderAirportDetails.bind(this);
    }

    renderAirportDetails() {
        const maxHeight = window.innerHeight;

        const {activeAirport} = this.props;
        const flagUrl = `${process.env.PUBLIC_URL}/flags/${activeAirport.State.toLowerCase()}.gif`;
        return (
            <div>
                <h2 align={"center"} style={{wordBreak: "break-all"}}>{activeAirport.AirportName}</h2>
                <h4 align={"center"}>{activeAirport.iata}/{activeAirport.Airport}</h4>
                <Container>
                    <Row>
                        <Col><p align={"center"}><img src={flagUrl} alt={activeAirport.State} width={16} height={11} /> {activeAirport.Name}<br />
                            {activeAirport.city !== '' ? <><b>City: </b> {activeAirport.city}</> : undefined }</p></Col>
                    </Row>

                    <Row><h4>2019 statistics</h4></Row>
                    <Row style={{paddingLeft: 5}}><b>Departures</b>&nbsp;{activeAirport.Departures.toLocaleString()}</Row>
                    <Row style={{paddingLeft: 5}}><b>International</b>&nbsp;{activeAirport.International.toLocaleString()}</Row>
                    <Row style={{paddingLeft: 5}}><b>Domestic</b>&nbsp;{activeAirport.Domestic.toLocaleString()}</Row>

                    <Row style={{marginTop: 15, alignContent: "center"}}>
                        <h4>Busiest routes</h4>
                        <RouteDetailTable />
                    </Row>
                </Container>
            </div>
        )
    }

    render() {
        return (
            <div className={"sidebar"}>
                {this.props.activeAirport ? this.renderAirportDetails() : <p align={"center"}>Click on an airport for more information</p> }
            </div>
        )
    }
}
const mapStateToProps = (state) => {
    return {
        activeAirport: state.activeAirport
    };
};

const mapDispatchToProps= (dispatch) => {
    return {
        setActiveAirport: (airport) => dispatch(setActiveAirport(airport)),
        unsetActiveAirport: () => dispatch(unsetActiveAirport())
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(AirportDetails)
