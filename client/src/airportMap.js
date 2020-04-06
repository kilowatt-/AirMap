import airportDepartureData from './airportdeparturedata.json';

function getAirportMap() {
    let airportMap = new Map();

    for (let elem of airportDepartureData) {
        airportMap.set(elem.Airport, elem);
    }

    return airportMap;
}

export const airportMap =  getAirportMap();
