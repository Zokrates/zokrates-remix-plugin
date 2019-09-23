import React from 'react';
import { Accordion as BootstrapAccordion } from 'react-bootstrap';

export const Accordion: React.FC = ({ children }) => {

    return <BootstrapAccordion defaultActiveKey="0">{children}</BootstrapAccordion>;
}