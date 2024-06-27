import React from "react";
import { Card, Col, Row } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const ListOfAudience = ({ data }: { data: any }) => {
  let navigator = useNavigate();
  if (data.length === 0) return <h3>No Audience Found</h3>;
  return (
    <>
      <Row>
        {data.map((value: any, index: number) => {
          const date = new Date(value.created);

          const formattedDate = date.toLocaleString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          });

          return (
            <Col key={index} lg="4" md="6" xs="12" className="mt-2 mb-2">
              <Card style={{ width: "18rem" }}>
                <Card.Body>
                  <Card.Title>{value.title}</Card.Title>
                  <Card.Subtitle className="mb-2 text-muted">
                    {formattedDate}
                  </Card.Subtitle>
                  <Card.Text>Size of the Audience: {value.size}</Card.Text>
                  <Card.Link
                    style={{ cursor: "pointer", color: "black" }}
                    onClick={() => {
                      navigator(`/campaign/${value._id}`);
                    }}
                  >
                    Launch Campaign
                  </Card.Link>
                </Card.Body>
              </Card>
            </Col>
          );
        })}
      </Row>
    </>
  );
};

export default ListOfAudience;
