import {CircleMarker, Map as LeafletMap, Marker, TileLayer} from "react-leaflet";
import * as React from "react";
import airportDepartureData from '../airportdeparturedata.json';
import {setActiveAirport, unsetActiveAirport} from "../controller/actions";
import {connect} from "react-redux";
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import {airportMap} from "../airportMap";

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
            visibleAirports: [],
            vL: 0,
            rL: MIN_ZOOM*10
        };

        this.mapRef = React.createRef();
        this.handlePositionChange = this.handlePositionChange.bind(this);
        this.updateVisibleAirportsOnMap = this.updateVisibleAirportsOnMap.bind(this);
        this.renderCircle = this.renderCircle.bind(this);
        this.renderActiveAirport = this.renderActiveAirport.bind(this);
        this.unsetActiveAirport = this.unsetActiveAirport.bind(this);
        this.renderRoutes = this.renderRoutes.bind(this);
        this.renderMarkers = this.renderMarkers.bind(this);
        this.handleZoomChange = this.handleZoomChange.bind(this);
    }

    handlePositionChange() {
        if (this.mapRef) {
            let position = this.mapRef.leafletElement.getCenter();

            this.setState({ position });

            if (!this.props.activeAirport) {
                this.updateVisibleAirportsOnMap();
            }
        }
    }

    handleZoomChange() {
        let zoom = this.mapRef.leafletElement.getZoom();
        let rL = this.calculateRL(zoom);

        this.setState({zoom, rL});
    }

    updateVisibleAirportsOnMap() {
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

        let vL = 0;
        if (visibleAirports.length > 0) {
            vL = visibleAirports[0].Departures;
        }

        this.setState( {visibleAirports, vL} );


    }

    calculateRL(zoom) {
        return zoom * 10;
    }

    renderRoutes() {
        let airportDatabase = airportMap;
        let { routes } = this.props;

        let airportArray = routes.map((destination) => {
            let airport = airportDatabase.get(destination.airport);
            airport.Departures = destination.departures;
            return airport;
        });

        return airportArray.map((airport) => {
            return this.renderCircle(airport, true);
        });
    }

    renderCircle(airport, representsRoute) {

        const lng = airport.coordinates[0];
        const lat = airport.coordinates[1];
        const vC = airport.Departures;
        const { rL, vL } = this.state;

        const circleRatio = (vC/vL);

        const radius = Math.pow(circleRatio, CIRCLE_EXPONENT) * rL;

        console.log("radius: " + radius);

        return <CircleMarker center={[lat,lng]} key={airport.Airport} radius={radius} onClick={(e) => {
            if (!representsRoute) {
                const position = [lat, lng];
                this.mapRef.leafletElement.flyTo(position, this.state.zoom, {duration: 0.25});
                this.props.setActiveAirport(airport);
            }

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
        if (this.props.activeAirport) {
            this.props.unsetActiveAirport();
        }
    }

    renderMarkers() {

        if (this.props.activeAirport) {
            if (this.props.routes) {
                const routes = this.renderRoutes();
                routes.push(this.renderActiveAirport());
                return routes;
            }
            return this.renderActiveAirport();
        } else {

            return this.state.visibleAirports.map((airport) => {
                return this.renderCircle(airport, false);
            });
        }
    }

    render() {
        return (
            <div><LeafletMap onClick={this.unsetActiveAirport} onZoomEnd={this.handleZoomChange} worldCopyJump={true} center={this.state.position} zoom={this.state.zoom} ref={(m) => this.mapRef = m}
                             maxBoundsViscosity={1} onMoveEnd={this.handlePositionChange} whenReady={this.updateVisibleAirportsOnMap} maxBounds={[[-90, -180], [90, 180]]} >
                <TileLayer
                    minZoom={MIN_ZOOM}
                    maxZoom={MAX_ZOOM}
                    attribution='&copy; <a href="https://stadiamaps.com/">Stadia Maps</a>, &copy; <a href="https://openmaptiles.org/">OpenMapTiles</a> &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors <br />
                Data sources: ICAO iSTARS API Data Service, OpenSky Network'
                    url="https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png"
                />
                {this.renderMarkers()}

            </LeafletMap>
            </div>)
    }
}

const mapStateToProps = (state) => {
    return {
        activeAirport: state.activeAirport,
        routes: state.routes,
    };
};

const mapDispatchToProps= (dispatch) => {
    return {
        setActiveAirport: (airport) => dispatch(setActiveAirport(airport)),
        unsetActiveAirport: () => dispatch(unsetActiveAirport())
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(MainMap);
