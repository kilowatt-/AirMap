import "./style.css";
import React from 'react';
import Navbar from "react-bootstrap/Navbar";

const Footer = () => {
    return (
        <Navbar bg="dark" variant="dark" expand="lg" sticky={"bottom"}>
            <Navbar.Text>&copy; 2020 Kean Wah Wong</Navbar.Text>
        </Navbar>
    )
}

export default Footer;
