import React, { useEffect, useState } from "react";
import {
  Button,
  Card,
  Col,
  Container,
  FloatingLabel,
  Form,
  Modal,
  Row,
} from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import NavBar from "./NavBar";

const Campaign = () => {
  const [authenticated, setAuthenticated] = useState(false);
  const [campaignData, setCampaignData] = useState([]);
  const [show, setShow] = useState(false);
  const [data, setData] = useState({
    title: "",
    msg: "",
  });
  const { id } = useParams();

  const navigator = useNavigate();

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleChange = (e: any) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const fetchData = async () => {
    const response = await fetch(
      `${process.env.REACT_APP_API_URL}/campaign/data`,
      {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ audienceId: id }),
      }
    );
    const data = await response.json();
    if (data.success) setCampaignData(data.data);
  };
  useEffect(() => {
    const checkAuth = async () => {
      const res = await fetch(
        `${process.env.REACT_APP_API_URL}/auth/verify-session`,
        {
          method: "GET",
          credentials: "include",
        }
      );
      const response = await res.json();
      if (response?.authenticated) {
        setAuthenticated(true);
      } else {
        setTimeout(() => {
          navigator("/login");
        }, 2000);
      }
    };
    checkAuth();
    fetchData();
  }, []);

  const sendMsg = async () => {
    const response = await fetch(
      `${process.env.REACT_APP_API_URL}/campaign/create`,
      {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title: data.title, msg: data.msg, id }),
      }
    );
    const result = await response.json();
    if (result.success) {
      fetchData();
      handleClose();
    }
  };
  if (!authenticated) {
    return (
      <div>
        Your not authorized for this page, redirect to the login screen....
      </div>
    );
  }
  return (
    <>
      <NavBar />
      <Container className="pt-5">
        <Row className="d-flex align-items-center justify-content-between">
          <Col xs="auto">
            <svg
              cursor={"pointer"}
              onClick={() => {
                navigator("/");
              }}
              xmlns="http://www.w3.org/2000/svg"
              width="2rem"
              height="2rem"
              fill="currentColor"
              className="bi bi-arrow-left-short"
              viewBox="0 0 16 16"
            >
              <path
                fill-rule="evenodd"
                d="M12 8a.5.5 0 0 1-.5.5H5.707l2.147 2.146a.5.5 0 0 1-.708.708l-3-3a.5.5 0 0 1 0-.708l3-3a.5.5 0 1 1 .708.708L5.707 7.5H11.5a.5.5 0 0 1 .5.5"
              />
            </svg>
          </Col>
          <Col>
            <h1>List Of Campaigns</h1>
          </Col>
          <Col xs="auto">
            <Button
              style={{ backgroundColor: "black", border: "none" }}
              onClick={handleShow}
            >
              Create new
            </Button>
          </Col>
        </Row>
        {campaignData.length === 0 ? (
          <h3>No Campaign Found</h3>
        ) : (
          <>
            <Row>
              {campaignData.map((value: any, index: number) => {
                let size: number = 0;
                let send: number = 0;
                value.deliveryStatus.map((val: any) => {
                  if (val.status === true) send++;
                  size++;
                });
                const date = new Date(value.created);

                const formattedDate = date.toLocaleString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                });

                if (value.message.length > 69) {
                  value.message = value.message.substring(0, 70);
                  value.message += "...";
                }
                return (
                  <Col lg="4" md="6" xs="12" className="mt-2 mb-2">
                    <Card style={{ width: "18rem" }}>
                      <Card.Body>
                        <Card.Title>{value.name}</Card.Title>
                        <Card.Subtitle className="mb-2 text-muted">
                          {formattedDate}
                        </Card.Subtitle>
                        <Card.Text>{value.message}</Card.Text>
                        <Card.Text>
                          <Row>
                            <Col style={{ fontWeight: "bolder" }}>
                              Size: {size !== 0 ? size : "..."}
                            </Col>
                            <Col style={{ fontWeight: "bolder" }}>
                              Rate:{" "}
                              {size > 0
                                ? Math.round((send / size) * 100)
                                : "..."}
                              %
                            </Col>
                          </Row>
                        </Card.Text>
                        <Card.Text>
                          <Row>
                            <Col style={{ fontWeight: "bolder" }}>
                              Send: {size !== 0 ? send : "..."}
                            </Col>
                            <Col style={{ fontWeight: "bolder" }}>
                              Failed: {size !== 0 ? size - send : "..."}
                            </Col>
                          </Row>
                        </Card.Text>
                      </Card.Body>
                    </Card>
                  </Col>
                );
              })}
            </Row>
          </>
        )}
      </Container>
      <Modal show={show} onHide={handleClose} centered>
        <Modal.Header
          closeButton
          style={{ backgroundColor: "black", color: "white" }}
        >
          <Modal.Title>Create new Campaign</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <FloatingLabel
            controlId="floatingInput"
            label="Campaign Title"
            className="mb-3"
          >
            <Form.Control type="text" name="title" onChange={handleChange} />
          </FloatingLabel>
          <FloatingLabel
            controlId="floatingInput"
            label="Message"
            className="mb-3"
          >
            <Form.Control type="text" name="msg" onChange={handleChange} />
          </FloatingLabel>
        </Modal.Body>
        <Modal.Footer>
          <Button
            style={{
              backgroundColor: "white",
              color: "black",
              borderColor: "black",
            }}
            onClick={handleClose}
          >
            Close
          </Button>
          <Button
            style={{ backgroundColor: "black", color: "white" }}
            onClick={sendMsg}
          >
            Send
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default Campaign;
