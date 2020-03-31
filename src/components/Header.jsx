import Navbar from "react-bootstrap/Navbar";
import React from "react";

const Header = (props) => {
    return (<Navbar bg="dark" variant="dark" expand="lg" sticky={"top"}>
        <Navbar.Brand href="#home" bg="light">AirMap</Navbar.Brand>
    </Navbar>);
};

export default Header;
