import {Table} from "react-bootstrap";
import * as React from "react";
import {getRouteDataForActiveAirport} from "../controller/actions";
import {connect} from "react-redux";
import Spinner from "react-bootstrap/Spinner";
import {airportMap} from "../airportMap";

class RouteDetailTable extends React.Component {
    componentDidMount() {
        this.props.getRouteData(this.props.activeAirport.Airport);
    }

    render() {
        if (this.props.fetchingData) {
            return (
                <Spinner animation="border" role="status">
                    <span className="sr-only">Loading...</span>
                </Spinner>
            )
        } else if (this.props.fetchingDataErr !== '') {
            return (
                <p style={{color: "red"}} align={"center"}>{this.props.fetchingDataErr}</p>
            )
        } else {
            return (
                <Table striped bordered hover size="sm" variant={"dark"} responsive={true} >
                    <thead>
                    <tr>
                        <th></th>
                        <th>Airport</th>
                        <th>Departures</th>
                    </tr>
                    </thead>
                    <tbody>
                    {this.props.routes ? this.props.routes.map((object, index) => {
                        let airportDetails = airportMap.get(object.airport);
                        const flagUrl = `${process.env.PUBLIC_URL}/flags/${airportDetails.State.toLowerCase()}.gif`;
                        return (
                            <tr>
                                <td>{index+1}</td>
                                <td><img src={flagUrl} /> {airportDetails.AirportName} ({airportDetails.iata}/{airportDetails.Airport})</td>
                                <td>{object.departures.toLocaleString()}</td>
                            </tr>
                        )
                    }) : undefined}
                    </tbody>
                </Table>
            )
        }
    }
}

const mapStateToProps = (state) => {
    return {
        routes: state.routes,
        activeAirport: state.activeAirport,
        fetchingData: state.fetchingData,
        fetchingDataErr: state.fetchingDataErr,
    };
};

const mapDispatchToProps= (dispatch) => {
    return {
        getRouteData: (airport) => dispatch(getRouteDataForActiveAirport(airport))
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(RouteDetailTable);
