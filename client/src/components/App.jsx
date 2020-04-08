import * as React from "react";
import Header from "./Header";
import Content from "./Content";
import Footer from "./Footer";
import {Container} from "react-bootstrap";
import Col from "react-bootstrap/Col";
import About from "./About";

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            showModal: false,
        };

        this.setShow = this.setShow.bind(this);
        this.renderModal = this.renderModal.bind(this);
    }

    setShow(show) {
        this.setState({
            showModal: show,
        });
    }

    renderModal() {
        if (this.state.showModal) {
            return <About setShow={this.setShow}/>;
        } else {
            return <></>;
        }
    }

    render() {
        return (
            <>
                <Container fluid style={{ paddingLeft: 0, paddingRight: 0, marginLeft: 0}}>
                    <Col style={{flex: 0.1, flexDirection: "column", paddingLeft: 0, paddingRight: 0, marginLeft: 0}}> <Header showModal={this.state.showModal} modalCallback={this.setShow} /></Col>
                    <Col style={{flex: 0.80, flexDirection: "column", paddingLeft: 0, paddingRight: 0, marginLeft: 0}}>  <Content /></Col>
                    <Col style={{flex: 0.1, flexDirection: "column", paddingLeft: 0, paddingRight: 0, marginLeft: 0}}> <Footer /></Col>
                </Container>

                {this.renderModal()}

            </>


        );
    }
}

export default App;
