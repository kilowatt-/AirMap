import {CircleMarker, Map, TileLayer} from "react-leaflet";
import * as React from "react";
import airportdeparturedata from '../airportdeparturedata.json';

const MIN_ZOOM = 3;
const MAX_ZOOM = 20;

const position = [10, 0];

class MainMap extends React.Component {

    constructor(props) {
       super(props);

       this.state = {
           zoom: MIN_ZOOM,
           position,
           loading: true,
           visibleAirports: []
       };

        this.mapRef = React.createRef();
        this.handlePositionChange = this.handlePositionChange.bind(this);
        this.updateAirportsOnMap = this.updateAirportsOnMap.bind(this);
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

        console.log(sw);

        let visibleAirports = [];

        for (let elem of airportdeparturedata) {
            let lat = elem.coordinates[1];
            let lng = elem.coordinates[0];

            if (lat >= sw.lat && lat <= ne.lat && lng >= sw.lng && lng <= ne.lng) {
                visibleAirports.push(elem);
            }

            if (visibleAirports.length === 100) {
                break;
            }
        }

        console.log(JSON.stringify(visibleAirports));

        this.setState( {visibleAirports})
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

                {this.state.visibleAirports.map((elem) => {
                    let lat = elem.coordinates[1];
                    let lng = elem.coordinates[0];

                    return <CircleMarker center={[lat,lng]}/>
                })}
        </Map>
            </div>)
    }
}

export default MainMap;
