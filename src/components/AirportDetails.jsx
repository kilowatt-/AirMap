import * as React from "react";
import {setActiveAirport, unsetActiveAirport} from "../controller/actions";
import {connect} from "react-redux";

class AirportDetails extends React.Component {
    constructor(props) {
        super(props);

        this.renderAirportDetails = this.renderAirportDetails.bind(this);
    }

    renderAirportDetails() {
        const {activeAirport} = this.props;
        return (
            <div>
                <h2 align={"center"} style={{wordBreak: "break-all"}}>{activeAirport.AirportName}</h2>
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
