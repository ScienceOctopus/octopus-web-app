import React from "react";
import { Button, Form, Nav, Navbar, NavItem } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import "../App.css";
import WebURI from "../urls/WebsiteURIs";
import { Link, withRouter } from "react-router-dom";
import styled from "styled-components";

const Header = ({ location }) => {
  return (
    <Navbar variant="dark" style={styles.bar}>
      <LinkContainer to={WebURI.Home}>
        <Navbar.Brand>
          <img
            className="logo mx-3"
            src="/images/octopus.png"
            alt="Octopus Logo"
            width="40"
            height="40"
          />
          {"Octopus"}
        </Navbar.Brand>
      </LinkContainer>
      <Nav>
        <LinkContainer to={WebURI.UploadPublication}>
          <Nav.Link active={location.pathname === WebURI.UploadPublication}>
            Upload
          </Nav.Link>
        </LinkContainer>
      </Nav>

      <Navbar.Toggle />
      <Navbar.Collapse className="justify-content-end">
        <Nav>
          <NavItem>
            <img
              src="/images/avatar.jpg"
              width="50"
              className="rounded-circle px-2"
              alt="Avatar of Alex"
            />
            <Navbar.Text>Alex</Navbar.Text>
          </NavItem>

          <NavItem>
            <Form inline>
              <Button className="mx-2" variant="outline-light">
                Logout
              </Button>
            </Form>
          </NavItem>
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
};

const styles = {
  bar: {
    backgroundColor: "teal",
    padding: "2px 10em",
    verticalAlign: "middle",
  },
};

export default withRouter(Header);
