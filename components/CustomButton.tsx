import React, { PropsWithChildren } from "react";
import { TouchableOpacity, TouchableOpacityProps } from "react-native";

// * The {} can be used to extend with additional props if needed
type CustomButtonProps = {} & TouchableOpacityProps;

const CustomButton: React.FC<PropsWithChildren<CustomButtonProps>> = (
  props
) => {
  return (
    <TouchableOpacity
      className="w-full bg-blue-600 p-4 rounded-lg items-center"
      {...props}
    >
      {props.children}
    </TouchableOpacity>
  );
};

export default CustomButton;
