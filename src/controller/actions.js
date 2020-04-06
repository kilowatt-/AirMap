const START_TIME_EPOCH = 1577836800;
const END_TIME_EPOCH = 1578441600;

export const SET_ACTIVE_AIRPORT = "SET_ACTIVE_AIRPORT";
export const UNSET_ACTIVE_AIRPORT = "UNSET_ACTIVE_AIRPORT";

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
