import { Map, TileLayer} from "react-leaflet";
import * as React from "react";

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
    }

    render() {
        return (
            <div><Map center={this.state.position} zoom={this.state.zoom} ref={(m) => this.mapRef = m} maxBoundsViscosity={1} onMoveEnd={this.handlePositionChange} >
            <TileLayer
                minZoom={MIN_ZOOM}
                maxZoom={MAX_ZOOM}
                attribution='&copy; <a href="https://stadiamaps.com/">Stadia Maps</a>, &copy; <a href="https://openmaptiles.org/">OpenMapTiles</a> &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors <br />
                Data sources: IATA Airport Departure Data, 2019 '
                url="https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png"
            />
        </Map>
            </div>)
    }
}

export default MainMap;
