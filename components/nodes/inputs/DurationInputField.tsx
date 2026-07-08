import { Text, TextInput, View } from "react-native";
import {
  StandardFieldProps,
  DurationField,
  FieldNode,
} from "../../../constants/nodeTypes";
import { useTheme } from "../../../hooks/use-theme-provider";

export default function DurationInputField({
  template,
  id,
  fieldKey,
  defaultShown,
  field,
  locked = false,
  onChange,
}: StandardFieldProps<DurationField>) {
  const theme = useTheme();

  return (
    <>
      <Text
        style={[
          theme.sizes.default.text,
          {
            color: theme.colors.text,
            fontFamily: theme.fonts?.regular.fontFamily,
          },
        ]}
      >
        {fieldKey}
      </Text>

      <View
        style={[
          theme.sizes.default.container,
          theme.sizes.default.row,
        ]}
      >
        <TextInput
          value={String(field.valueA)}
          onChangeText={(newText) => {
            onChange?.(
              template,
              defaultShown,
              {
                id: id,
                type: "field",
                field: {
                  ...field,
                  valueA: Number(newText),
                } as DurationField,
              } as FieldNode
            );
          }}
          style={[
            theme.sizes.default.input,
            {
              backgroundColor: theme.colors.card,
              borderColor: theme.colors.border,
              color: theme.colors.text,
              fontFamily: theme.fonts?.regular.fontFamily,
            },
          ]}
          editable={!locked}
        />

        <Text
          style={[
            theme.sizes.default.text,
            {
              color: theme.colors.text,
              fontFamily: theme.fonts?.regular.fontFamily,
            },
          ]}
        >
          {field.unitA}
        </Text>

        <TextInput
          value={String(field.valueB)}
          onChangeText={(newText) => {
            onChange?.(
              template,
              defaultShown,
              {
                id: id,
                type: "field",
                field: {
                  ...field,
                  valueB: Number(newText),
                } as DurationField,
              } as FieldNode
            )
          }}
          style={[
            theme.sizes.default.input,
            {
              backgroundColor: theme.colors.card,
              borderColor: theme.colors.border,
              color: theme.colors.text,
              fontFamily: theme.fonts?.regular.fontFamily,
            },
          ]}
          editable={!locked}
        />

        <Text
          style={[
            theme.sizes.default.text,
            {
              color: theme.colors.text,
              fontFamily: theme.fonts?.regular.fontFamily,
            },
          ]}
        >
          {field.unitB}
        </Text>
      </View>
    </>
  );
}