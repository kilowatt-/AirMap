import {SET_ACTIVE_AIRPORT, UNSET_ACTIVE_AIRPORT} from "./actions";

const initialState = {
    activeAirport: undefined
};

export const detailReducer = (state = initialState, action) => {
    switch (action.type) {
        case SET_ACTIVE_AIRPORT:
            return {...state, activeAirport: action.payload};
        case UNSET_ACTIVE_AIRPORT:
            return {...state, activeAirport: undefined};
        default:
            return state;
    }
};
