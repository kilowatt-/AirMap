import * as React from "react";
import Header from "./Header";
import Content from "./Content";
import Footer from "./Footer";
import {Container} from "react-bootstrap";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

class App extends React.Component {
    render() {
        return (
            <>
                <Container fluid style={{ paddingLeft: 0, paddingRight: 0, marginLeft: 0}}>
                    <Col style={{flex: 0.1, flexDirection: "column", paddingLeft: 0, paddingRight: 0, marginLeft: 0}}> <Header /></Col>
                    <Col style={{flex: 0.8, flexDirection: "column", paddingLeft: 0, paddingRight: 0, marginLeft: 0}}>  <Content /></Col>
                    <Col style={{flex: 0.1, flexDirection: "column", paddingLeft: 0, paddingRight: 0, marginLeft: 0}}> <Footer /></Col>
                </Container>



            </>


        );
    }
}

export default App;
