import React from 'react';
import { Component } from '../../../common/abiTypes';
import { ExpandableInput } from './ExpandableInput';
import { FormGroup } from 'react-bootstrap';
import { InputComponent } from './InputComponent';

export interface ArrayInputProps {
    component: Component;
    value: any;
    validate?: (value: string) => boolean;
    transform?: (value: string) => any;
    onChange: (value: any) => void;
}

export const ArrayInput: React.FC<ArrayInputProps> = (props) => {
    let { value, component, onChange } = props;
    let arrayComponent = component.components as Component;
    const components = [...Array(arrayComponent.size)].map((_, index) => {
        return { 
            name: index.toString(),
            type: arrayComponent.type,
            components: arrayComponent.components
        }
    });

    const onChangeHandler = (index: number, inner: string, value: any) => {
        if (!value) {
            value = Array(arrayComponent.size - 1);
        }
        value[index] = inner;
        return onChange(value);
    }

    return (
        <ExpandableInput {...props}>
            {components.map((component, index) => 
                <FormGroup key={`${component.name}~${index}`}>
                    <InputComponent
                        component={component} 
                        value={value && value[index]}
                        onChange={(inner) => onChangeHandler(index, inner, value)} />
                </FormGroup>
            )}
        </ExpandableInput>
    );
}