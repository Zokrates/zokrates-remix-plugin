import React from "react";
import { Alert as BAlert, Col, Row } from "react-bootstrap";

export const Alert = ({ variant, iconClass, children }) => (
  <Row>
    <Col>
      <BAlert variant={variant} className="d-flex">
        <i
          className={iconClass + " mr-2"}
          aria-hidden="true"
          style={{ marginTop: "3px" }}
        ></i>
        {children}
      </BAlert>
    </Col>
  </Row>
);
