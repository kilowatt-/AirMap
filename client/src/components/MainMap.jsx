import {
    CircleMarker, LayersControl,
    Map as LeafletMap,
    Marker,
    Popup,
    TileLayer
} from "react-leaflet";
import * as React from "react";
import airportDepartureData from '../airportdeparturedata.json';
import {setActiveAirport, unsetActiveAirport} from "../controller/actions";
import {connect} from "react-redux";
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { GeodesicLine } from 'react-leaflet-geodesic'
import Legend from "./Legend";

delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
    iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
    iconUrl: require('leaflet/dist/images/marker-icon.png'),
    shadowUrl: require('leaflet/dist/images/marker-shadow.png')
});

const MIN_ZOOM = 3;
const MAX_ZOOM = 10;
const ZOOM_RL_MULTIPLIER = 8;
export const CIRCLE_EXPONENT = 0.57;

export const AIRPORT_LIMIT = 50;

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
            rL: MIN_ZOOM*ZOOM_RL_MULTIPLIER
        };

        this.mapRef = React.createRef();
        this.handlePositionChange = this.handlePositionChange.bind(this);
        this.updateVisibleAirportsOnMap = this.updateVisibleAirportsOnMap.bind(this);
        this.renderCircle = this.renderCircle.bind(this);
        this.renderActiveAirport = this.renderActiveAirport.bind(this);
        this.unsetActiveAirport = this.unsetActiveAirport.bind(this);
        this.renderMarkers = this.renderMarkers.bind(this);
        this.handleZoomChange = this.handleZoomChange.bind(this);
        this.drawLines = this.drawLines.bind(this);
    }

    componentDidMount() {
        const script = document.createElement("script");

        script.src = "https://cdn.jsdelivr.net/npm/leaflet.geodesic";
        script.async = true;

        document.body.appendChild(script);
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if ((prevProps.activeAirport && !this.props.activeAirport) || (this.props.activeAirport && prevProps.routes !== this.props.routes)) {
            this.updateVisibleAirportsOnMap();
        }

        if ((!prevProps.fetchingData && this.props.fetchingData) || (!prevProps.activeAirport && this.props.activeAirport)) {
            this.setState({visibleAirports: []});
        }
    }

    handlePositionChange() {
        if (this.mapRef) {
            let position = this.mapRef.leafletElement.getCenter();

            this.setState({ position });

            this.updateVisibleAirportsOnMap();
        }
    }

    handleZoomChange() {
        if (this.mapRef) {
            let zoom = this.mapRef.leafletElement.getZoom();
            let rL = zoom * ZOOM_RL_MULTIPLIER;

            this.setState({zoom, rL});
        }
    }

    updateVisibleAirportsOnMap() {
        let bounds = this.mapRef.leafletElement.getBounds();
        let sw = bounds._southWest;
        let ne = bounds._northEast;

        let visibleAirports = [];
        let source = (this.props.activeAirport) ? this.props.routes : airportDepartureData;

        if (source) {
            for (let elem of source) {

                let lng = elem.coordinates[0];
                let lat = elem.coordinates[1];

                if (lat >= sw.lat && lat <= ne.lat && lng >= sw.lng && lng <= ne.lng) {
                    visibleAirports.push(elem);
                }

                if (!this.props.activeAirport && visibleAirports.length === AIRPORT_LIMIT) {
                    break;
                }
            }

            let vL = 0;
            if (visibleAirports.length > 0) {
                vL = visibleAirports[0].Departures;
            }

            this.setState( {visibleAirports, vL} );
        }
    }

    drawLines() {
        let sourceLng = this.props.activeAirport.coordinates[0];
        let sourceLat = this.props.activeAirport.coordinates[1];

        let colours = ['#ff0000', '#66ff33', '#33ccff'];

        let lines = [];

        for (let i = 0; i < this.state.visibleAirports.length; i++) {
            let airport = this.state.visibleAirports[i];

            let lng = airport.coordinates[0];
            let lat = airport.coordinates[1];

            const waypoints = [ [sourceLat, sourceLng], [lat, lng] ];

            const options = {
                weight: 2,
                opacity: 0.5,
                color: colours[i % colours.length]
            };

            const line = <GeodesicLine positions={waypoints} options={options} />;

            lines.push(line);
        }

        return lines;
    }

    renderCircle(airport, representsRoute) {
        const lng = airport.coordinates[0];
        const lat = airport.coordinates[1];

        const vC = airport.Departures;
        const { rL, vL } = this.state;

        const circleRatio = (vC/vL);

        const radius = Math.pow(circleRatio, CIRCLE_EXPONENT) * rL;

        const flagUrl = `${process.env.PUBLIC_URL}/flags/${airport.State.toLowerCase()}.gif`;
        if (representsRoute) {

            return <CircleMarker center={{lat, lng}}
                                 color={"#59AE09"}
                                 key={airport.Airport} radius={radius} onClick={(e) => {L.DomEvent.stopPropagation(e);}}
                                 onMouseOver={(e) => {
                                     e.target.openPopup();
                                 }}
                                 onMouseOut={(e) => {
                                     e.target.closePopup();
                                 }}
            >
                <Popup closeButton={false}><img src={flagUrl} alt={airport.State.toLowerCase()} /> {`${airport.AirportName} (${airport.Airport}/${airport.iata}) - ${airport.Departures}`}</Popup>
            </CircleMarker>
        } else {

            return <CircleMarker center={{lat, lng}}
                                 color={"#59AE09"}
                                 key={airport.Airport} radius={radius} onClick={(e) => {
                const position = {lat, lng};
                this.mapRef.leafletElement.flyTo(position, this.state.zoom, {duration: 0.25});
                this.props.setActiveAirport(airport);
                L.DomEvent.stopPropagation(e);
            }} onMouseOver={(e) => {
                e.target.openPopup();
            }} onMouseOut={(e) => {
                e.target.closePopup();
            }}
            >
                <Popup closeButton={false}><img src={flagUrl} alt={airport.State.toLowerCase()} /> {`${airport.AirportName} (${airport.Airport}/${airport.iata})`}</Popup>
            </CircleMarker>
        }
    }

    renderActiveAirport() {
        const {activeAirport} = this.props;
        const lng = activeAirport.coordinates[0];
        const lat = activeAirport.coordinates[1];

        return <Marker position={{lat, lng}} onClick={e => L.DomEvent.stopPropagation(e)} color={"red"} />
    }

    unsetActiveAirport() {
        if (this.props.activeAirport) {
            this.props.unsetActiveAirport();
        }
    }

    renderMarkers() {
        if (this.props.activeAirport) {
            if (this.props.routes) {
                const routes = this.state.visibleAirports.map((airport) => {
                    return this.renderCircle(airport, true);
                });
                routes.push(this.renderActiveAirport());
                let lines = this.drawLines();
                return routes.concat(lines);
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
            <div><LeafletMap onClick={this.unsetActiveAirport} onZoomEnd={this.handleZoomChange} center={this.state.position} zoom={this.state.zoom} ref={(m) => this.mapRef = m}
                             onMoveEnd={this.handlePositionChange} whenReady={this.updateVisibleAirportsOnMap} maxBounds={[[-105, -195], [105, 195]]} worldCopyJump={true} >
                <TileLayer
                    detectRetina={true}
                    minZoom={MIN_ZOOM}
                    maxZoom={MAX_ZOOM}
                    attribution='&copy; <a href="https://stadiamaps.com/">Stadia Maps</a>, &copy; <a href="https://openmaptiles.org/">OpenMapTiles</a> &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors <br />
                Data sources: ICAO iSTARS API Data Service, OpenSky Network'
                    url="https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png"
                />
                <Legend visibleAirports={this.state.visibleAirports} rL={this.state.rL} active={(this.props.activeAirport !== undefined)} />
                {this.renderMarkers()}
            </LeafletMap>
            </div>)
    }
}

const mapStateToProps = (state) => {
    return {
        activeAirport: state.activeAirport,
        routes: state.routes,
        fetchingData: state.fetchingData
    };
};

const mapDispatchToProps= (dispatch) => {
    return {
        setActiveAirport: (airport) => dispatch(setActiveAirport(airport)),
        unsetActiveAirport: () => dispatch(unsetActiveAirport())
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(MainMap);
