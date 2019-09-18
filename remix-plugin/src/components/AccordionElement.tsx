import React from 'react';
import { Card, Accordion } from "react-bootstrap"

export type AccordionElementProps = {
    headerText: string,
    iconClass: string, 
    eventKey: string,
    disabled?: boolean;
}

export type Props = React.PropsWithChildren<AccordionElementProps>;

export const AccordionElement: React.FC<Props> = ({ headerText, iconClass, eventKey, disabled, children }) => (
    <Card>
        {disabled ? 
        <Card.Header className="text-secondary default-cursor">
            <i className={iconClass + " mr-2"} aria-hidden="true"></i>{headerText}
        </Card.Header> :
        <>
            <Accordion.Toggle as={Card.Header} eventKey={eventKey}>
                <i className={iconClass + " mr-2"} aria-hidden="true"></i>{headerText}
            </Accordion.Toggle>
            <Accordion.Collapse eventKey={eventKey}>
                <Card.Body>
                    {children}
                </Card.Body>
            </Accordion.Collapse>
        </>
        }
    </Card>
)