import React from "react";
import { LinkContainer } from "react-router-bootstrap";
import { Nav } from "react-bootstrap";
import { FaFacebookF } from "react-icons/fa";
import { FaTwitter } from "react-icons/fa";
import { FaInstagram } from "react-icons/fa";

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-content container">
        <span>About HoliDaze</span>
        <LinkContainer to="/contact-us">
          <Nav.Link className="footer-link">Contact admin</Nav.Link>
        </LinkContainer>
        <span>Frequently asked questions</span>
        <span className="footer-content-socials">
          <FaFacebookF />
          <FaTwitter />
          <FaInstagram />
        </span>
      </div>
      <span className="footer-copyright text-center">
        Copyright © Holidaze - Exam project by Arshad Shakil
      </span>
    </footer>
  );
}

export default Footer;
