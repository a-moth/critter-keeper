import { Text, TextInput, View } from "react-native";

import {
  parse,
  format,
  isValid,
} from "date-fns";

import { useTheme } from "../../../hooks/use-theme-provider";

import {
  DateField,
  FieldNode,
  StandardFieldProps,
} from "../../../constants/NodeTypes";

import { useSettings } from "../../../utils/SettingsProvider";

export default function DateInputField({
  template,
  id,
  fieldKey,
  defaultShown,
  field,
  locked = false,
  onChange,
}: StandardFieldProps<DateField>) {

  const theme = useTheme();

  const { settings } = useSettings();

  /**
   * date-fns tokens:
   *
   * dd
   * MM
   * MMM
   * yyyy
   * yy
   */

  const dateFormat =
    field.format ??
    settings["**dayFormat"] ??
    "dd-MM-yyyy";

  /**
   * Convert stored ISO value
   * into display string
   */

  function buildDisplayValue() {

    if (!field.value) {
      return "";
    }

    try {

      const parsed =
        new Date(field.value);

      if (!isValid(parsed)) {
        return "";
      }

      return format(
        parsed,
        dateFormat
      );

    } catch {

      return "";
    }
  }

  const displayValue =
    buildDisplayValue();

  /**
   * Parse typed input
   * into ISO storage format
   */

  function parseInput(
    value: string
  ) {

    try {

      const parsed =
        parse(
          value,
          dateFormat,
          new Date()
        );

      if (!isValid(parsed)) {
        return null;
      }

      return format(
        parsed,
        "yyyy-MM-dd"
      );

    } catch {

      return null;
    }
  }

  if (!defaultShown) {
    return null;
  }

  return (
    <View style={theme.sizes.default.container}>

      <Text
        style={[
          theme.sizes.default.text,
          {
            color:
              theme.colors.text,

            fontFamily:
              theme.fonts?.regular.fontFamily,
          },
        ]}
      >
        {fieldKey}
      </Text>

      <TextInput
        value={displayValue}
        editable={!locked}
        keyboardType="numeric"
        placeholder={dateFormat}
        placeholderTextColor={
          theme.colors.primary
        }
        onChangeText={(text) => {

          const isoValue =
            parseInput(text);

          /**
           * allow partial typing
           * without corrupting state
           */

          if (!isoValue) {
            return;
          }

          onChange?.(
            template,
            defaultShown,
            {
              id: id,
              type: "field",
              field: {
                ...field,
                value: isoValue,
              } as DateField,
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