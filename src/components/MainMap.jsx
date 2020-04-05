import {CircleMarker, Map, TileLayer} from "react-leaflet";
import * as React from "react";


const position = [0, 0];

class MainMap extends React.Component {
    render() {
        return <Map center={position} zoom={2}>
            <TileLayer
                minZoom={2}
                maxZoom={20}
                attribution='&copy; <a href="https://stadiamaps.com/">Stadia Maps</a>, &copy; <a href="https://openmaptiles.org/">OpenMapTiles</a> &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors'
                url="https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png"
            />
        </Map>
    }
}

export default MainMap;
