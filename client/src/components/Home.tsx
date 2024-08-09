import { useEffect, useState } from "react";
import {
  Button,
  Col,
  Container,
  FloatingLabel,
  Form,
  InputGroup,
  Modal,
  Row,
} from "react-bootstrap";
import ListOfAudience from "./ListOfAudience";
import NavBar from "./NavBar";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const Home = () => {
  const [data, setData] = useState([]);
  const [audienceTitle, setAudienceTitle] = useState("");
  const navigator = useNavigate();
  const [order, setOrder] = useState<string[]>([]);
  const [operators, setOperators] = useState<string[]>([]);
  const [currentOperator, setCurrentOperator] = useState("");
  const changeOperator = (e: any) => {
    setCurrentOperator(e.target.value);
  };
  const [fieldAvailable, setFieldAvailable] = useState({
    totalSpend: true,
    visits: true,
    lastVisits: true,
  });
  const [selectedField, setSelectedField] = useState({
    field: 0,
    name: "",
  });
  const [authenticated, setAuthenticated] = useState(false);
  const [show, setShow] = useState(false);
  const [audienceSize, setAudienceSize] = useState({
    show: false,
    size: 0,
  });

  const [totalSpend, setTotalSpend] = useState({
    active: false,
    option: -1,
    value1: 0,
    value2: 0,
  });
  const [visits, setVisits] = useState({
    active: false,
    option: -1,
    value1: 0,
    value2: 0,
  });

  const [lastVisits, setLastVisits] = useState({
    active: false,
    option: -1,
    value1: 0,
    value2: 0,
  });

  const fetchData = async () => {
    const response = await fetch(
      `${process.env.REACT_APP_API_URL}/audience/get`,
      {
        method: "GET",
        credentials: "include",
      }
    );
    const data = await response.json();
    if (data.success) setData(data.response);
  };

  const handleChange = (name: string, e: any) => {
    if (name === "totalSpend") {
      setTotalSpend({
        ...totalSpend,
        [e.target.name]: parseInt(e.target.value),
      });
    } else if (name === "visits") {
      setVisits({ ...visits, [e.target.name]: parseInt(e.target.value) });
    } else {
      setLastVisits({
        ...lastVisits,
        [e.target.name]: parseInt(e.target.value),
      });
    }
  };

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

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
  if (!authenticated) {
    return (
      <div>
        Your not authorized for this page, redirect to the login screen....
      </div>
    );
  }

  const checkSize = async () => {
    const res = await fetch(
      `${process.env.REACT_APP_API_URL}/audience/checkSize`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          order,
          operators,
          totalSpend,
          visits,
          lastVisits,
        }),
      }
    );
    const response = await res.json();
    if (response.success) {
      setAudienceSize({ show: true, size: response.size });
    } else {
      toast.error(response.message);
    }
  };

  const handleSave = async () => {
    const res = await fetch(`${process.env.REACT_APP_API_URL}/audience/save`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({
        title: audienceTitle,
        order,
        operators,
        totalSpend,
        visits,
        lastVisits,
      }),
    });
    const response = await res.json();
    if (response.success) {
      handleClear();
      handleClose();
      setTimeout(() => {
        fetchData();
      }, 1000);
    } else toast.error(response.message);
  };

  const handleClear = () => {
    setAudienceTitle("");
    setAudienceSize({ show: false, size: 0 });
    setOrder([]);
    setOperators([]);
    setFieldAvailable({
      totalSpend: true,
      visits: true,
      lastVisits: true,
    });
    setTotalSpend({
      active: false,
      option: -1,
      value1: 0,
      value2: 0,
    });
    setLastVisits({
      active: false,
      option: -1,
      value1: 0,
      value2: 0,
    });
    setVisits({
      active: false,
      option: -1,
      value1: 0,
      value2: 0,
    });
  };
  return (
    <>
      <NavBar />
      <Container className="pt-5">
        <Row className="d-flex align-items-center justify-content-between">
          <Col>
            <h1>Audience List</h1>
          </Col>
          <Col xs="auto">
            <Button
              style={{ backgroundColor: "black", border: "none" }}
              onClick={handleShow}
            >
              Add new Audience
            </Button>
          </Col>
        </Row>
        <ListOfAudience data={data} />
      </Container>
      <Modal show={show} onHide={handleClose} size="xl" centered>
        <Modal.Header
          closeButton
          style={{ backgroundColor: "black", color: "white" }}
        >
          <Modal.Title>Add a new Audience</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Row>
            <Col xs="auto">
              <FloatingLabel
                controlId="floatingInput"
                label="Audience Title"
                className="mb-3"
              >
                <Form.Control
                  type="text"
                  name="title"
                  value={audienceTitle}
                  onChange={(e) => {
                    setAudienceTitle(e.target.value);
                  }}
                />
              </FloatingLabel>
            </Col>
          </Row>
          <Row>
            <Col xs="auto">
              <Form.Select
                name="option"
                onChange={(e: any) => {
                  setSelectedField({
                    field: parseInt(e.target.value),
                    name:
                      parseInt(e.target.value) === 1
                        ? "totalSpend"
                        : parseInt(e.target.value) === 2
                        ? "visits"
                        : "lastVisit",
                  });
                }}
              >
                <option value="-1">Select Field</option>
                {fieldAvailable.totalSpend && (
                  <option value="1">Total Spend</option>
                )}
                {fieldAvailable.visits && (
                  <option value="2">Number of Visits</option>
                )}
                {fieldAvailable.lastVisits && (
                  <option value="3">Last Visit</option>
                )}
              </Form.Select>
            </Col>
          </Row>
          {selectedField.field !== 0 && (
            <Row className="mt-2 mb-2">
              <Col
                xs="2"
                className="d-flex align-items-center justify-content-start"
              >
                <p className="mb-0">
                  {selectedField.field === 1
                    ? "Total Spend"
                    : selectedField.field === 2
                    ? "Visits"
                    : "Last Visit"}
                </p>
              </Col>
              <Col>
                <Form.Select
                  onChange={(e: any) => handleChange(selectedField.name, e)}
                  name="option"
                  value={
                    selectedField.field === 1
                      ? totalSpend.option
                      : selectedField.field === 2
                      ? visits.option
                      : lastVisits.option
                  }
                >
                  <option value="-1">Value</option>
                  <option value="1">Between</option>
                  <option value="2">
                    {selectedField.field === 3 ? "Within" : "Min"}
                  </option>
                  <option value="3">
                    {selectedField.field === 3 ? "After" : "Max"}
                  </option>
                </Form.Select>
              </Col>
              <Col>
                <InputGroup>
                  {selectedField.field === 1 && (
                    <InputGroup.Text>₹</InputGroup.Text>
                  )}
                  <Form.Control
                    type="number"
                    min={0}
                    onChange={(e: any) => handleChange(selectedField.name, e)}
                    name="value1"
                    value={
                      selectedField.field === 1
                        ? totalSpend.value1
                        : selectedField.field === 2
                        ? visits.value1
                        : lastVisits.value1
                    }
                  />
                  {selectedField.field === 3 && (
                    <InputGroup.Text>months</InputGroup.Text>
                  )}
                </InputGroup>
              </Col>
              {(selectedField.field === 1
                ? totalSpend.option
                : selectedField.field === 2
                ? visits.option
                : lastVisits.option) === 1 && (
                <>
                  <Col
                    xs="auto"
                    className="d-flex align-items-center justify-content-center"
                    style={{ fontWeight: "bolder" }}
                  >
                    -
                  </Col>
                  <Col>
                    <InputGroup>
                      {selectedField.field === 1 && (
                        <InputGroup.Text>₹</InputGroup.Text>
                      )}
                      <Form.Control
                        type="number"
                        min={0}
                        onChange={(e: any) =>
                          handleChange(selectedField.name, e)
                        }
                        name="value2"
                        value={
                          selectedField.field === 1
                            ? totalSpend.value2
                            : selectedField.field === 2
                            ? visits.value2
                            : lastVisits.value2
                        }
                      />
                      {selectedField.field === 3 && (
                        <InputGroup.Text>months</InputGroup.Text>
                      )}
                    </InputGroup>
                  </Col>
                </>
              )}
              {order.length !== 0 && (
                <Col xs="auto">
                  <Form.Select
                    name="option"
                    value={currentOperator}
                    onChange={changeOperator}
                  >
                    <option value="-1">Condition</option>
                    <option value="OR">OR</option>
                    <option value="AND">AND</option>
                  </Form.Select>
                </Col>
              )}
              <Col xs="auto">
                <Button
                  style={{ backgroundColor: "black", border: "none" }}
                  onClick={() => {
                    if (order.length !== 0) {
                      setOperators([...operators, currentOperator]);
                      setCurrentOperator("");
                    }
                    if (selectedField.field === 1) {
                      setTotalSpend({ ...totalSpend, active: true });
                      setFieldAvailable({
                        ...fieldAvailable,
                        totalSpend: false,
                      });
                      setOrder([...order, "totalSpend"]);
                    } else if (selectedField.field === 2) {
                      setVisits({ ...visits, active: true });
                      setFieldAvailable({
                        ...fieldAvailable,
                        visits: false,
                      });
                      setOrder([...order, "visits"]);
                    } else {
                      setLastVisits({ ...lastVisits, active: true });
                      setFieldAvailable({
                        ...fieldAvailable,
                        lastVisits: false,
                      });
                      setOrder([...order, "lastVisits"]);
                    }
                    setSelectedField({ field: 0, name: "" });
                  }}
                >
                  Add
                </Button>
              </Col>
            </Row>
          )}
          {order.map((value, index) => {
            return (
              <div key={index}>
                {index !== 0 && (
                  <Row className="justify-content-center">
                    <Col xs="auto" style={{ fontWeight: "bolder" }}>
                      {operators[index - 1]}
                    </Col>
                  </Row>
                )}
                <Row className="mt-2 mb-2">
                  <Col
                    xs="2"
                    className="d-flex align-items-center justify-content-start"
                  >
                    <p className="mb-0">
                      {value === "totalSpend"
                        ? "Total Spend"
                        : value === "visits"
                        ? "Visits"
                        : "Last Visit"}
                    </p>
                  </Col>
                  <Col className="d-flex align-items-center justify-content-center">
                    <Form.Select
                      onChange={(e: any) => handleChange(value, e)}
                      name="option"
                      value={
                        value === "totalSpend"
                          ? totalSpend.option
                          : value === "visits"
                          ? visits.option
                          : lastVisits.option
                      }
                    >
                      <option value="-1">Value</option>
                      <option value="1">Between</option>
                      <option value="2">Min</option>
                      <option value="3">Max</option>
                    </Form.Select>
                  </Col>
                  <Col>
                    <InputGroup>
                      {value === "totalSpend" && (
                        <InputGroup.Text>₹</InputGroup.Text>
                      )}
                      <Form.Control
                        type="number"
                        min={0}
                        onChange={(e: any) => handleChange(value, e)}
                        name="value1"
                        value={
                          value === "totalSpend"
                            ? totalSpend.value1
                            : value === "visits"
                            ? visits.value1
                            : lastVisits.value1
                        }
                      />
                      {value === "lastVisits" && (
                        <InputGroup.Text>months</InputGroup.Text>
                      )}
                    </InputGroup>
                  </Col>
                  {(value === "totalSpend"
                    ? totalSpend.option
                    : value === "visits"
                    ? visits.option
                    : lastVisits.option) === 1 && (
                    <>
                      <Col
                        xs="auto"
                        style={{ fontWeight: "bolder" }}
                        className="d-flex align-items-center justify-content-center"
                      >
                        -
                      </Col>
                      <Col>
                        <InputGroup>
                          {value === "totalSpend" && (
                            <InputGroup.Text>₹</InputGroup.Text>
                          )}
                          <Form.Control
                            type="number"
                            min={0}
                            onChange={(e: any) => handleChange(value, e)}
                            name="value2"
                            value={
                              value === "totalSpend"
                                ? totalSpend.value2
                                : value === "visits"
                                ? visits.value2
                                : lastVisits.value2
                            }
                          />
                          {value === "lastVisits" && (
                            <InputGroup.Text>months</InputGroup.Text>
                          )}
                        </InputGroup>
                      </Col>
                    </>
                  )}
                </Row>
              </div>
            );
          })}
          <Row className="justify-content-end mt-2">
            {order.length !== 0 && (
              <Col xs="auto">
                <Button
                  style={{ backgroundColor: "black", border: "none" }}
                  onClick={handleClear}
                >
                  Clear
                </Button>
              </Col>
            )}
          </Row>
          {audienceSize.show && (
            <Row>
              <h5 className="mb-0" style={{ fontWeight: "bolder" }}>
                Audience Size: {audienceSize.size}
              </h5>
            </Row>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button
            style={{
              backgroundColor: "white",
              borderColor: "black",
              color: "black",
            }}
            onClick={checkSize}
            disabled={order.length === 0 ? true : false}
          >
            Check Size
          </Button>
          <Button
            style={{ backgroundColor: "black", border: "none" }}
            onClick={handleSave}
          >
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default Home;
