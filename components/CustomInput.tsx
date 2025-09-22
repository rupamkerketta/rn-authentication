import React from "react";
import { Control, Controller, FieldValues, Path } from "react-hook-form";
import { Text, TextInput, TextInputProps, View } from "react-native";

type CustomInputProps<T extends FieldValues> = {
  control: Control<T>;
  name: Path<T>;
  error?: string | boolean;
} & TextInputProps;

const CustomInput = <T extends FieldValues>({
  control,
  name,
  error,
  ...props
}: CustomInputProps<T>) => {
  return (
    <View className="gap-2">
      <Controller
        name={name}
        control={control}
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            className="p-4 rounded-lg border border-gray-300"
            {...props}
            onChangeText={onChange}
            onBlur={onBlur}
            value={value}
          />
        )}
      />
      <View className="h-6">
        {error && <Text className="text-red-500 mt-1">{error}</Text>}
      </View>
    </View>
  );
};

export default CustomInput;
