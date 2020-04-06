import {
    GET_ROUTES_ERROR,
    GET_ROUTES_FINISH,
    GET_ROUTES_START,
    SET_ACTIVE_AIRPORT,
    UNSET_ACTIVE_AIRPORT
} from "./actions";
import {airportMap} from "../airportMap";

const initialState = {
    activeAirport: undefined,

    fetchingData: false,
    fetchingDataErr: '',

    routes: undefined,
};

function processData(data, activeAirport) {
    let routesMap = new Map();

    for (let response of data.data) {
        const arrivalAirport = response.estArrivalAirport;

        if (routesMap.has(arrivalAirport)) {
            let count = routesMap.get(arrivalAirport);
            count += 1;
            routesMap.set(arrivalAirport, count);
        } else {
            routesMap.set(arrivalAirport, 1);
        }
    }

    let routes = [];

    const iterator = routesMap[Symbol.iterator]();

    for (let item of iterator) {
        let object = {
            "airport": item[0],
            "departures": item[1]
        };

        if (object.airport !== activeAirport.Airport && airportMap.has(object.airport)) {
            routes.push(object);
        }
    }

    routes.sort((a, b) => {
        return b.departures - a.departures;
    });

    console.log("ROUTES: " + routes);
    return routes;
}

export const reducer = (state = initialState, action) => {
    switch (action.type) {
        case SET_ACTIVE_AIRPORT:
            return {...state, activeAirport: action.payload};
        case UNSET_ACTIVE_AIRPORT:
            return {...state, activeAirport: undefined};
        case GET_ROUTES_START:
            return {...state, fetchingData: true, fetchingDataErr: ''};
        case GET_ROUTES_FINISH:
            return {...state, fetchingData: false, routes: processData(action.payload, state.activeAirport)};
        case GET_ROUTES_ERROR:
            return {...state, fetchingData: false, fetchingDataErr: action.payload};
        default:
            return state;
    }
};
