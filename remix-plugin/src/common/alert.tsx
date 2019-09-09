import React from 'react';
import { Row, Col, Alert, AlertProps } from 'react-bootstrap';

export const showAlert = (variant: AlertProps["variant"], iconClass: string, message: string) => {
    return (
        <Row>
            <Col>
                <Alert variant={variant}>
                    <i className={iconClass + " mr-2"} aria-hidden="true"></i>{message}
                </Alert>
            </Col>
        </Row>
    );
}