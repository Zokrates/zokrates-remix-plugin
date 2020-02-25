import React, { useState } from 'react';
import { Button, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { Component } from '../../../common/abiTypes';
import { TextInput } from './TextInput';

export interface ExpandableInputProps {
    component: Component;
    value: any;
    validate?: (value: string) => boolean;
    transform?: (value: string) => any;
    onChange: (value: any) => void;
}

export const ExpandableInput: React.FC<ExpandableInputProps> = (props) => {
    const [expanded, setExpanded] = useState(false);
    const { component, value, validate, transform, onChange, children } = props;

    const Expander = <i className={`fa fa-angle-${expanded ? "up": "down"}`} style={{ cursor: "pointer" }} />;

    if (!expanded) {
        return <TextInput
            component={component}
            value={value}
            validate={validate}
            transform={transform}
            append={
                <Button variant="light" className="border" onClick={() => setExpanded(!expanded)}>
                    {Expander}
                </Button>
            } 
            onChange={onChange}
        />;
    }

    return (
        <div className="expandable border">
            <div className="expandable-header bg-light border-bottom">
                <span className="text-muted">
                {component.public != undefined && !component.public && 
                    <OverlayTrigger placement="top" 
                        overlay={<Tooltip id={`tooltip-${component.name}`}>Private Input</Tooltip>}>
                        <i className="fa fa-lock mr-2" aria-hidden="true"></i>
                    </OverlayTrigger>}
                {component.name}
                </span>
                <span id="expander" onClick={() => setExpanded(!expanded)}>{Expander}</span>
            </div>
            <div className="expandable-body">
                {children}
            </div>
        </div>
    );
}