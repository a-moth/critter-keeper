import {
  useState,
} from "react";

import {
  Text,
  TextInput,
  View,
} from "react-native";

import { useTheme } from "../../../hooks/use-theme-provider";

import {
  FieldNode,
  StandardFieldProps,
  TextField,
} from "../../../constants/NodeTypes";

export default function TextInputField({
  id,
  template,
  fieldKey,
  defaultShown,
  field,
  locked = false,
  onChange,
}: StandardFieldProps<TextField>) {

  const theme = useTheme();

  const [text, setText] = useState(
    field.value ?? ""
  );

  /**
   * only sync external updates
   * don't overwrite active typing
   */

  if (!defaultShown) {
    return null;
  }

  return (
    <View style={theme.sizes.default.container}>

      <Text
        style={[
          theme.sizes.default.text,
          {
            color: theme.colors.text,
            fontFamily:
              theme.fonts?.regular.fontFamily,
          },
        ]}
      >
        {fieldKey}
      </Text>

      <TextInput
        value={text}
        editable={!locked}
        onChangeText={(newText) => {

          setText(newText);

          onChange?.(
            template,
            defaultShown,
            {
              id: id,
              type: "field",
              field: field,
              value: newText,
            } as FieldNode
          );
        }}
        style={[
          theme.sizes.default.input,
          {
            backgroundColor:
              theme.colors.card,

            borderColor:
              theme.colors.border,

            color:
              theme.colors.text,

            fontFamily:
              theme.fonts?.regular.fontFamily,
          },
        ]}
      />

    </View>
  );
}