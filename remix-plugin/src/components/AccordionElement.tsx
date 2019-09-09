import React from 'react';
import { Card, Accordion } from "react-bootstrap"

export const AccordionElement = ({ headerText, iconClass, eventKey, children }) => (
    <Card>
        <Accordion.Toggle as={Card.Header} eventKey={eventKey}>
            <i className={iconClass + " mr-2"} aria-hidden="true"></i>{headerText}
        </Accordion.Toggle>
        <Accordion.Collapse eventKey={eventKey}>
            <Card.Body>
                {children}
            </Card.Body>
        </Accordion.Collapse>
    </Card>
)