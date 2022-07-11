import React from "react";
import { Component } from "../../../common/abiTypes";
import { ExpandableInput } from "./ExpandableInput";
import { FormGroup } from "react-bootstrap";
import { InputComponent } from "./InputComponent";

export interface TupleInputProps {
  component: Component;
  value: any;
  validate?: (value: string) => boolean;
  transform?: (value: string) => any;
  onChange: (value: any) => void;
}

export const TupleInput: React.FC<TupleInputProps> = (props) => {
  let { value, component, onChange } = props;
  const components = component.components.elements.map((e, index) => {
    return {
      ...e,
      name: `${component.name}.${index.toString()}`,
    };
  });

  const onChangeHandler = (index: number, inner: string, value: any) => {
    if (!(value instanceof Array)) {
      value = Array(component.components.elements.length - 1);
    }
    value[index] = inner;
    return onChange(value);
  };

  return (
    <ExpandableInput {...props}>
      {components.map((component, index) => (
        <FormGroup key={`${component.name}~${index}`}>
          <InputComponent
            component={component}
            value={
              value instanceof Array && value[index] !== undefined
                ? value[index]
                : ""
            }
            onChange={(inner) => onChangeHandler(index, inner, value)}
          />
        </FormGroup>
      ))}
    </ExpandableInput>
  );
};
