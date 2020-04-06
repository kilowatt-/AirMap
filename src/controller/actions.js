import axios from "axios";

const START_TIME_EPOCH = 1577836800;
const END_TIME_EPOCH = 1578441600;

export const SET_ACTIVE_AIRPORT = "SET_ACTIVE_AIRPORT";
export const UNSET_ACTIVE_AIRPORT = "UNSET_ACTIVE_AIRPORT";

export const GET_ROUTES_START = "GET_ROUTES_START";
export const GET_ROUTES_FINISH = "GET_ROUTES_FINISH";
export const GET_ROUTES_ERROR = "GET_ROUTES_ERROR";

export function setActiveAirport(airport) {
    return {
        type: SET_ACTIVE_AIRPORT,
        payload: airport
    }
}

export function unsetActiveAirport() {
    return {
        type: UNSET_ACTIVE_AIRPORT
    }
}

export function getRoutesStart() {
    return {
        type: GET_ROUTES_START,
    }
}

export function getRoutesFinish(data) {
    return {
        type: GET_ROUTES_FINISH,
        payload: data
    }
}

export function getRoutesError(err) {
    return {
        type: GET_ROUTES_ERROR,
        payload: err
    }
}

export function getRouteDataForActiveAirport(airportCode) {
    const url = process.env.REACT_APP_OPENSKY_API_URL;

    return async dispatch => {
        dispatch(getRoutesStart());
        try {
            const data = await axios.get(url, {
                params: {
                    begin: START_TIME_EPOCH,
                    end: END_TIME_EPOCH,
                    airport: airportCode
                }
            });

            dispatch(getRoutesFinish(data));
        } catch (err) {
            let status = err.response.status;
            let errMsg;
            if (status === 404) {
                errMsg = 'Sorry, no departure data found for this airport.'
            } else if (status === 504) {
                errMsg = 'Sorry, the API is unable to respond at the moment. Please try again later.'
            } else {
                errMsg = 'Sorry, we had trouble fetching departure data. Please try again later.'
            }
            dispatch(getRoutesError(errMsg));
        }

    }
}
