import React from 'react';
import { FormGroup } from 'react-bootstrap';
import { Component } from '../../../common/abiTypes';
import { ExpandableInput } from './ExpandableInput';
import { InputComponent } from './InputComponent';

export interface StructInputProps {
    component: Component;
    value: any;
    validate?: (value: string) => boolean;
    transform?: (value: string) => any;
    onChange: (value: any) => void;
}

export const StructInput: React.FC<StructInputProps> = (props) => {
    let { value, component, onChange } = props;
    let components = component.components as Component[];
    return (
        <ExpandableInput {...props}>
            {components.map((component, index) => 
                <FormGroup key={`${component.name}~${index}`}>
                    <InputComponent
                        component={component} 
                        value={value && value[component.name]}
                        onChange={(inner) => onChange({ ...value, [component.name]: inner })} />
                </FormGroup>
            )}
        </ExpandableInput>
    );
}