import {Table} from "react-bootstrap";
import * as React from "react";
import {getRouteDataForActiveAirport} from "../controller/actions";
import {connect} from "react-redux";
import Spinner from "react-bootstrap/Spinner";

class RouteDetailTable extends React.Component {
    componentDidMount() {
        this.props.getRouteData(this.props.activeAirport.Airport);
    }

    render() {
        if (this.props.fetchingData) {
            return (
                <Spinner animation="border" role="status" />
            )
        } else if (this.props.fetchingDataErr !== '') {
            return (
                <p style={{color: "red"}} align={"center"}>{this.props.fetchingDataErr}</p>
            )
        } else {
            return (
                <div style={{"overflowY": "scroll", "maxHeight": "75vh"}}>
                    <Table striped bordered hover size="sm" variant={"dark"} responsive={true} >
                        <thead>
                        <tr>
                            <th> </th>
                            <th>Airport</th>
                            <th>Estimated Weekly Departures</th>
                        </tr>
                        </thead>
                        <tbody>
                        {this.props.routes ? this.props.routes.map((airport, index) => {
                            const flagUrl = `${process.env.PUBLIC_URL}/flags/${airport.State.toLowerCase()}.gif`;
                            return (
                                <tr key={index}>
                                    <td>{index+1}</td>
                                    <td><img src={flagUrl} alt={airport.State} /> {airport.AirportName} ({airport.iata}/{airport.Airport})</td>
                                    <td>{airport.Departures.toLocaleString()}</td>
                                </tr>
                            )
                        }) : undefined}
                        </tbody>
                    </Table>
                </div>

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
