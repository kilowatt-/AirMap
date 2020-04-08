import { MapControl, withLeaflet } from "react-leaflet";
import L from "leaflet";
import {CIRCLE_EXPONENT} from "./MainMap";

const MAX_NUMBER_OF_CIRCLES = 4;

class Legend extends MapControl {

    constructor(props) {
        super(props);
        this.addLegend = this.addLegend.bind(this);
        this.removeLegend = this.removeLegend.bind(this);

        this.state = {
            legendControl: undefined
        }
    }
    createLeafletElement(props) {}

    componentDidMount() {
        const legendControl = L.control({ position: "bottomright" });

        this.setState({legendControl})
    }

    calculateRadii() {
        let radiusArray = [];
        let { visibleAirports, rL } = this.props;
        let length = visibleAirports.length;

        if (visibleAirports && visibleAirports.length > 0) {
            const denominator = (length < MAX_NUMBER_OF_CIRCLES) ? length : MAX_NUMBER_OF_CIRCLES;
            const vL= visibleAirports[0].Departures;



            for (let i = 0; i < denominator; i++) {
                let index = Math.ceil((i/denominator) * (length -1));
                let vC = visibleAirports[index].Departures;

                const circleRatio = (vC/vL);
                const radius = Math.pow(circleRatio, CIRCLE_EXPONENT) * rL;

                radiusArray.push({radius:radius, number: vC});
            }
        }


        return radiusArray;
    }

    addLegend() {
        const { map } = this.props.leaflet;
        const {legendControl} = this.state;


        this.state.legendControl.onAdd = () => {
            const div = L.DomUtil.create("div", "info legend");
            const grades = this.calculateRadii();
            let labels = [];

            for (let i = 0; i < grades.length; i++) {

                labels.push(
                    `<svg height="${this.props.rL*2.1}" width="${this.props.rL*2.1}">
                      <circle cx="50%" cy="50%" r="${grades[i].radius}" stroke="#59AE09" stroke-width="3" fill="#59AE09" fill-opacity="0.2" />
                    </svg>
                    ${grades[i].number.toLocaleString()}`
                );
            }

            let labelText = (this.props.active) ? "Weekly departures" : "Departures";
            div.innerHTML = `<b>${labelText}</b><br />${labels.join("<br />")}`;

            return div;
        };
        legendControl.addTo(map);
    }

    removeLegend() {
        const { legendControl } = this.state;
        const { map } = this.props.leaflet;

        legendControl.remove(map);
    }

    componentDidUpdate(prevProps) {
        if (prevProps.visibleAirports !== this.props.visibleAirports) {
            if (this.props.visibleAirports.length > 0) {
                this.addLegend();
            } else {
                this.removeLegend();
            }
        }
    }
}

export default withLeaflet(Legend);
