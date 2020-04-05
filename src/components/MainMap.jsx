import {CircleMarker, Map, TileLayer} from "react-leaflet";
import * as React from "react";
import airportDepartureData from '../airportdeparturedata.json';

const MIN_ZOOM = 3;
const MAX_ZOOM = 15;
const CIRCLE_EXPONENT = 0.57;

const AIRPORT_LIMIT = 50;

const position = [10, 0];

class MainMap extends React.Component {

    constructor(props) {
       super(props);

       this.state = {
           zoom: MIN_ZOOM,
           position,
           loading: true,
           visibleAirports: [],
           vL: 0,
           rL: 50
       };

        this.mapRef = React.createRef();
        this.handlePositionChange = this.handlePositionChange.bind(this);
        this.updateAirportsOnMap = this.updateAirportsOnMap.bind(this);
        this.renderCircle = this.renderCircle.bind(this);
    }

    handlePositionChange() {
        if (this.mapRef) {
            let position = this.mapRef.leafletElement.getCenter();
            let zoom = this.mapRef.leafletElement.getZoom();

            this.setState({position, zoom});

            this.updateAirportsOnMap();
        }
    }

    updateAirportsOnMap() {
        let bounds = this.mapRef.leafletElement.getBounds();
        let sw = bounds._southWest;
        let ne = bounds._northEast;


        let visibleAirports = [];

        for (let elem of airportDepartureData) {
            let lng = elem.coordinates[0];
            let lat = elem.coordinates[1];

            if (lat >= sw.lat && lat <= ne.lat && lng >= sw.lng && lng <= ne.lng) {
                visibleAirports.push(elem);
            }

            if (visibleAirports.length === AIRPORT_LIMIT) {
                break;
            }
        }

        let vL, rL = 0;

        if (visibleAirports.length > 0) {
            vL = visibleAirports[0].Departures;
            rL = this.calculateRL(visibleAirports);
        }
        this.setState( {visibleAirports, vL,rL})
    }

    calculateRL(visibleAirports) {
        //TODO: Figure out how to best calculate rL. 50 for now.
        return 50;
    }

    renderCircle(airport) {
        const lng = airport.coordinates[0];
        const lat = airport.coordinates[1];
        const vC = airport.Departures;
        const { rL, vL } = this.state;

        const circleRatio = (vC/vL);

        const radius = Math.pow(circleRatio, CIRCLE_EXPONENT) * rL;

        return <CircleMarker center={[lat,lng]} radius={radius} />
    }

    render() {
        return (
            <div><Map center={this.state.position} zoom={this.state.zoom} ref={(m) => this.mapRef = m} maxBoundsViscosity={1} onMoveEnd={this.handlePositionChange} whenReady={this.updateAirportsOnMap} >
            <TileLayer
                minZoom={MIN_ZOOM}
                maxZoom={MAX_ZOOM}
                attribution='&copy; <a href="https://stadiamaps.com/">Stadia Maps</a>, &copy; <a href="https://openmaptiles.org/">OpenMapTiles</a> &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors <br />
                Data sources: IATA Airport Departure Data, 2019 '
                url="https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png"
            />

                {this.state.visibleAirports.map((airport) => {
                    return this.renderCircle(airport);
                })}
        </Map>
            </div>)
    }
}

export default MainMap;
