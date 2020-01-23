import React from 'react';
import { Component } from '../../../common/abiTypes';
import { TextInput } from './TextInput';

const fromJson = (input: string) => {
    try {
        return JSON.parse(input);
    } catch (_) {
        return false;
    }
}

export interface InputComponentProps {
    component: Component;
    value: string;
    onChange: (raw: string, value: any) => void;
}

export const InputComponent: React.FC<InputComponentProps> = (props) => {
    const { component } = props;

    switch (component.type) {
        case "field":
            return <TextInput {...props} 
                    validate={value => /^-?\d+$/.test(value)} />;
        case "bool":
            return <TextInput {...props} 
                    validate={value => /^(true|false)$/.test(value)} 
                    transform={value => value === 'true'} />;
        case "struct":
            return <TextInput {...props} 
                    validate={value =>  fromJson(value)} 
                    transform={value => fromJson(value) || value} />;
        case "array":
            return <TextInput {...props}
                    validate={value =>  fromJson(value)} 
                    transform={value => fromJson(value) || value} />;
        default:
            throw new Error("Unsupported component type");
    }
}