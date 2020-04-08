import axios from "axios";

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
    const url = process.env.REACT_APP_API_URL;

    return async dispatch => {
        dispatch(getRoutesStart());
        try {
            const res = await axios.get(`${url}/${airportCode}`);

            dispatch(getRoutesFinish(res.data));
        } catch (err) {
            let errMsg;
            if (err.response) {
                let status = err.response.status;

                if (status === 404) {
                    errMsg = 'Sorry, no route data found for this airport.'
                } else if (status === 502 || status === 503) {
                    errMsg = 'Sorry, the data service is unable to respond at the moment. Please try again later.'
                } else {
                    errMsg = 'Sorry, we had trouble fetching route data. Please try again later.'
                }
            } else {
                errMsg = 'Sorry, we had trouble fetching route data. Please try again later.'
            }

            dispatch(getRoutesError(errMsg));
        }

    }
}
