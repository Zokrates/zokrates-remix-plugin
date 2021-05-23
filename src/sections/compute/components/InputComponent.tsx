import React from "react";
import { Component } from "../../../common/abiTypes";
import { ArrayInput } from "./ArrayInput";
import { StructInput } from "./StructInput";
import { TextInput } from "./TextInput";
import jsonschema from "jsonschema";

const fromJson = (input: string) => {
  try {
    return JSON.parse(input);
  } catch (_) {
    return input;
  }
};

export interface InputComponentProps {
  component: Component;
  value: any;
  onChange: (value: any) => void;
}

const createValidationSchema = (component: Component) => {
  switch (component.type) {
    case "field": {
      return {
        type: "string",
        pattern: /^-?\d+$/,
        required: true,
      };
    }
    case "u8": {
      return {
        type: "string",
        pattern: new RegExp(`^0x[0-9a-f]{2}$`),
        required: true,
      };
    }
    case "u16": {
      return {
        type: "string",
        pattern: new RegExp(`^0x[0-9a-f]{4}$`),
        required: true,
      };
    }
    case "u32": {
      return {
        type: "string",
        pattern: new RegExp(`^0x[0-9a-f]{8}$`),
        required: true,
      };
    }
    case "u64": {
      return {
        type: "string",
        pattern: new RegExp(`^0x[0-9a-f]{16}$`),
        required: true,
      };
    }
    case "bool": {
      return {
        type: "boolean",
        required: true,
      };
    }
    case "array": {
      return {
        type: "array",
        minItems: component.components.size,
        maxItems: component.components.size,
        items: createValidationSchema(component.components),
        required: true,
      };
    }
    case "struct": {
      return {
        type: "object",
        properties: component.components.members.reduce(
          (result: any, component: Component) => {
            result[component.name] = createValidationSchema(component);
            return result;
          },
          {}
        ),
        required: true,
      };
    }
  }
};

const createValidator = (
  component: Component,
  transform?: (value: string) => any
) => {
  return (value: string) =>
    jsonschema.validate(
      transform ? transform(value) : value,
      createValidationSchema(component)
    ).valid;
};

export const InputComponent: React.FC<InputComponentProps> = (props) => {
  const { component } = props;
  switch (component.type) {
    case "bool":
      return (
        <TextInput
          {...props}
          transform={(value) => fromJson(value)}
          validate={createValidator(component, (value) => fromJson(value))}
        />
      );
    case "struct":
      return (
        <StructInput
          {...props}
          transform={(value) => fromJson(value)}
          validate={createValidator(component, (value) => fromJson(value))}
        />
      );
    case "array":
      return (
        <ArrayInput
          {...props}
          transform={(value) => fromJson(value)}
          validate={createValidator(component, (value) => fromJson(value))}
        />
      );
    default:
      return <TextInput {...props} validate={createValidator(component)} />;
  }
};
