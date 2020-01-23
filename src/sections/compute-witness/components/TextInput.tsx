import React from 'react';
import { FormControl, InputGroup, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { Component } from '../../../common/abiTypes';

export interface TextInputProps {
    component: Component;
    value: string,
    validate?: (value: string) => boolean;
    transform?: (value: string) => any;
    onChange: (raw: string, value: any) => void
}

export const TextInput: React.FC<TextInputProps> = (props) => {

    const { component, value, validate, transform, onChange} = props;
    
    const onChangeHandler = (e: any) => {
        let raw = e.currentTarget.value;
        let value = transform ? transform(e.currentTarget.value) : raw;
        onChange(raw, value);
    }

    const isValid = validate ? validate(value) : true;
    return (
        <InputGroup size="sm">
            <InputGroup.Prepend>
                {component.public != undefined && !component.public && 
                <OverlayTrigger key={component.name} placement="top" overlay={<Tooltip id={`tooltip-${component.name}`}>Private Input</Tooltip>}>
                    <InputGroup.Text><i className="fa fa-lock" aria-hidden="true"></i></InputGroup.Text>
                </OverlayTrigger>}
                <InputGroup.Text>{component.name}</InputGroup.Text>
            </InputGroup.Prepend>
            <FormControl type="text" 
                name={component.name} value={value} 
                required={true} 
                onChange={onChangeHandler}
                placeholder={component.type}
                isValid={validate && isValid}
                isInvalid={value && !isValid} />
        </InputGroup>
    );
}