import React from "react";
import { FormGroup } from "react-bootstrap";
import { Component } from "../../../common/abiTypes";
import { ExpandableInput } from "./ExpandableInput";
import { InputComponent } from "./InputComponent";
import { TextInput } from "./TextInput";

export interface StructInputProps {
  component: Component;
  value: any;
  validate?: (value: string) => boolean;
  transform?: (value: string) => any;
  onChange: (value: any) => void;
}

export const StructInput: React.FC<StructInputProps> = (props) => {
  let { value, component, onChange } = props;
  let components = (component.components as Component).members;

  const onChangeHandler = (component: Component, inner: string, value: any) => {
    if (typeof value === "object") {
      return onChange({ ...value, [component.name]: inner });
    }
    return onChange({ [component.name]: inner });
  };

  if (components.length === 0) {
    return <TextInput {...props} />;
  }

  return (
    <ExpandableInput {...props}>
      {components.map((component, index) => (
        <FormGroup key={`${component.name}~${index}`}>
          <InputComponent
            component={component}
            value={value && value[component.name]}
            onChange={(inner) => onChangeHandler(component, inner, value)}
          />
        </FormGroup>
      ))}
    </ExpandableInput>
  );
};
