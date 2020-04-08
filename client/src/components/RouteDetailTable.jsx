import {Table} from "react-bootstrap";
import * as React from "react";
import {getRouteDataForActiveAirport} from "../controller/actions";
import {connect} from "react-redux";
import Spinner from "react-bootstrap/Spinner";
import './style.css';

class RouteDetailTable extends React.Component {
    componentDidMount() {
        this.props.getRouteData(this.props.activeAirport.Airport);
    }

    render() {
        if (this.props.fetchingData) {
            return (
                <div style={{"alignContents": "center"}}>
                    <Spinner animation="border" role="status" variant={"primary"} />
                </div>
            )
        } else if (this.props.fetchingDataErr !== '') {
            return (
                <p style={{color: "red"}} align={"center"}>{this.props.fetchingDataErr}</p>
            )
        } else {
            return (
                <div className={"tableDiv"}>
                    <Table striped bordered hover size="sm" variant={"dark"} responsive={true} style={{"width": "100%"}} >
                        <thead >
                        <tr>
                            <th className={"fit"} align={"center"}> </th>
                            <th className={"fit"} align={"center"}>Airport</th>
                            <th className={"fit"} align={"center"}>Estimated Weekly Departures</th>
                        </tr>
                        </thead>
                        <tbody>
                        {this.props.routes ? this.props.routes.map((airport, index) => {
                            const flagUrl = `${process.env.PUBLIC_URL}/flags/${airport.State.toLowerCase()}.gif`;
                            return (
                                <tr key={index}>
                                    <td className={"fit"}>{index+1}</td>
                                    <td className={"fit"}><img src={flagUrl} alt={airport.State} /> {airport.AirportName} ({airport.iata}/{airport.Airport})</td>
                                    <td className={"fit"}>{airport.Departures.toLocaleString()}</td>
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
