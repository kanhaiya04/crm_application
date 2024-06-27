import React from "react";
import { Button, Col, Container, Row } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const NavBar = () => {
  const navigator = useNavigate();
  const handleLogOut = async () => {
    let response = await fetch(`${process.env.REACT_APP_API_URL}/auth/logout`, {
      method: "GET",
      credentials: "include",
    });
    if (response) response = await response.json();
    //@ts-ignore
    if (response.success) {
      navigator("/login");
    }
  };
  return (
    <Container
      fluid
      style={{ color: "white", backgroundColor: "black", padding: "0.5% 1%" }}
    >
      <Row className="d-flex align-items-center justify-content-between">
        <Col>
          <h1>CRM</h1>
        </Col>
        <Col xs="auto">
          <Button
            style={{ backgroundColor: "white", border: "none", color: "black" }}
            onClick={handleLogOut}
          >
            Logout
          </Button>
        </Col>
      </Row>
    </Container>
  );
};

export default NavBar;
