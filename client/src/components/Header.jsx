import Navbar from "react-bootstrap/Navbar";
import {Nav} from "react-bootstrap";
import React from "react";

const Header = (props) => {
    return (<Navbar bg="dark" variant="dark" expand="lg" sticky={"top"}>
        <Navbar.Brand href="#home" bg="light">AirMap</Navbar.Brand>
        <Nav className="mr-auto">
            <Nav.Item>
                <Nav.Link eventKey={"about"} active={false} onSelect={() => {props.modalCallback(true)}}>About</Nav.Link>
            </Nav.Item>
        </Nav>
    </Navbar>);
};

export default Header;
