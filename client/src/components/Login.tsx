import React from "react";
import { Col, Container, Row } from "react-bootstrap";
import GoogleButton from "react-google-button";

const Login = () => {
  return (
    <>
      <Container fluid>
        <Row className="align-items-center" style={{ height: "100vh" }}>
          <Col className="heading text-center">
            Welcome
            <br />
            <h3 style={{ fontSize: "0.5em" }}>to CRM</h3>
          </Col>
          <Col className=" text-center">
            <img src="./crm.png" alt="" width={"700rem"} height={"500rem"} />
            <GoogleButton
              style={{ margin: "auto" }}
              type="dark" // can be light or dark
              onClick={() => {
                window.location.href = `${process.env.REACT_APP_API_URL}/auth/github`;
              }}
            />
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default Login;
