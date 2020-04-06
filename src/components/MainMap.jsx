import {CircleMarker, Map as LeafletMap, Marker, TileLayer} from "react-leaflet";
import * as React from "react";
import airportDepartureData from '../airportdeparturedata.json';
import {setActiveAirport, unsetActiveAirport} from "../controller/actions";
import {connect} from "react-redux";
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
    iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
    iconUrl: require('leaflet/dist/images/marker-icon.png'),
    shadowUrl: require('leaflet/dist/images/marker-shadow.png')
});

const MIN_ZOOM = 3;
const MAX_ZOOM = 10;
const CIRCLE_EXPONENT = 0.57;

const AIRPORT_LIMIT = 50;

const position = [0, 0];

class MainMap extends React.Component {

    constructor(props) {
       super(props);

       this.state = {
           zoom: MIN_ZOOM,
           position,
           loading: true,
           visibleAirports: new Map(),
           vL: 0,
           rL: 50
       };

        this.mapRef = React.createRef();
        this.handlePositionChange = this.handlePositionChange.bind(this);
        this.updateAirportsOnMap = this.updateAirportsOnMap.bind(this);
        this.renderCircle = this.renderCircle.bind(this);
        this.renderActiveAirport = this.renderActiveAirport.bind(this);
        this.unsetActiveAirport = this.unsetActiveAirport.bind(this);
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


        let visibleAirports = new Map();

        for (let elem of airportDepartureData) {
            let lng = elem.coordinates[0];
            let lat = elem.coordinates[1];

            if (lat >= sw.lat && lat <= ne.lat && lng >= sw.lng && lng <= ne.lng) {
                visibleAirports.set(elem.Airport, elem);
            }

            if (visibleAirports.size === AIRPORT_LIMIT) {
                break;
            }
        }

        let vL, rL = 0;

        if (visibleAirports.size > 0) {
            vL = visibleAirports.values().next().value.Departures;
            rL = this.calculateRL();
        }

        this.setState( {visibleAirports, vL,rL})
    }

    calculateRL() {
        return this.state.zoom * 10;
    }

    renderCircle(airport) {
        const lng = airport.coordinates[0];
        const lat = airport.coordinates[1];
        const vC = airport.Departures;
        const { rL, vL } = this.state;

        const circleRatio = (vC/vL);

        const radius = Math.pow(circleRatio, CIRCLE_EXPONENT) * rL;

        return <CircleMarker center={[lat,lng]} radius={radius} onClick={(e) => {
            const position = [lat, lng];
            const zoom = MAX_ZOOM/2;
            this.mapRef.leafletElement.flyTo(position, (this.state.zoom > zoom) ? zoom : this.state.zoom, {duration: 0.25});


            this.props.setActiveAirport(airport);

            L.DomEvent.stopPropagation(e);
        }} />
    }

    renderActiveAirport() {
        const {activeAirport} = this.props;
        const lng = activeAirport.coordinates[0];
        const lat = activeAirport.coordinates[1];

        return <Marker position={[lat, lng]} onClick={e => L.DomEvent.stopPropagation(e)} />
    }

    unsetActiveAirport() {
        if (Object.keys(this.props.activeAirport).length > 0) {
            this.props.unsetActiveAirport();
        }
    }

    render() {
        const array = Array.from(this.state.visibleAirports.values());
        const isActiveAirportPresent = Object.keys(this.props.activeAirport).length > 0;
        return (
            <div><LeafletMap onClick={this.unsetActiveAirport}worldCopyJump={true} center={this.state.position} zoom={this.state.zoom} ref={(m) => this.mapRef = m} maxBoundsViscosity={1} onMoveEnd={this.handlePositionChange} whenReady={this.updateAirportsOnMap} >
            <TileLayer
                minZoom={MIN_ZOOM}
                maxZoom={MAX_ZOOM}
                attribution='&copy; <a href="https://stadiamaps.com/">Stadia Maps</a>, &copy; <a href="https://openmaptiles.org/">OpenMapTiles</a> &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors <br />
                Data sources: IATA Airport Departure Data, 2019 '
                url="https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png"
            />
                {isActiveAirportPresent ? this.renderActiveAirport() : array.map((airport) => {
                    return this.renderCircle(airport);
                })}

        </LeafletMap>
            </div>)
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

export default connect(mapStateToProps, mapDispatchToProps)(MainMap);
