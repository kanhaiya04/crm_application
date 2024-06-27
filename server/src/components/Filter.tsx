import React, { useState } from "react";
import { Form, Button, Row, Col, Container } from "react-bootstrap";

const FilterComponent = ({
  filters,
  setFilters,
}: {
  filters: any;
  setFilters: any;
}) => {
  const [selectedField, setSelectedField] = useState("");
  const [condition, setCondition] = useState("AND");
  const [value1, setValue1] = useState("");
  const [value2, setValue2] = useState("");
  const [active, setActive] = useState(true);

  const fields = ["totalSpend", "visits", "lastVisits"];

  const addFilter = () => {
    setFilters([
      ...filters,
      { field: selectedField, active, condition, value1, value2 },
    ]);
    setSelectedField("");
    setValue1("");
    setValue2("");
  };

  const removeFilter = (index: any) => {
    setFilters(filters.filter((_: any, i: any) => i !== index));
  };

  return (
    <Container>
      <Row>
        <Col>
          <Form.Group controlId="fieldSelect">
            <Form.Label>Select Field</Form.Label>
            <Form.Control
              as="select"
              value={selectedField}
              onChange={(e) => setSelectedField(e.target.value)}
            >
              <option value="">Select Field</option>
              {fields.map((field) => (
                <option key={field} value={field}>
                  {field}
                </option>
              ))}
            </Form.Control>
          </Form.Group>
        </Col>
        <Col>
          <Form.Group controlId="activeSelect">
            <Form.Label>Active</Form.Label>
            <Form.Check
              type="checkbox"
              label="Active"
              checked={active}
              onChange={(e) => setActive(e.target.checked)}
            />
          </Form.Group>
        </Col>
        <Col>
          <Form.Group controlId="conditionSelect">
            <Form.Label>Condition</Form.Label>
            <Form.Control
              as="select"
              value={condition}
              onChange={(e) => setCondition(e.target.value)}
            >
              <option value="AND">AND</option>
              <option value="OR">OR</option>
            </Form.Control>
          </Form.Group>
        </Col>
      </Row>
      <Row>
        <Col>
          <Form.Group controlId="value1Input">
            <Form.Label>Value 1</Form.Label>
            <Form.Control
              type="number"
              value={value1}
              onChange={(e) => setValue1(e.target.value)}
            />
          </Form.Group>
        </Col>
        <Col>
          <Form.Group controlId="value2Input">
            <Form.Label>Value 2</Form.Label>
            <Form.Control
              type="number"
              value={value2}
              onChange={(e) => setValue2(e.target.value)}
            />
          </Form.Group>
        </Col>
        <Col>
          <Button
            variant="primary"
            onClick={addFilter}
            disabled={!selectedField}
          >
            Add Filter
          </Button>
        </Col>
      </Row>
      <Row>
        <Col>
          <ul>
            {filters.map((filter: any, index: any) => (
              <li key={index}>
                {filter.field} {filter.condition} {filter.value1} -{" "}
                {filter.value2}{" "}
                <Button variant="danger" onClick={() => removeFilter(index)}>
                  Remove
                </Button>
              </li>
            ))}
          </ul>
        </Col>
      </Row>
    </Container>
  );
};

export default FilterComponent;
