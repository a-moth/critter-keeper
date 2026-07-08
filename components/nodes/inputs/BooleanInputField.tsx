import { Text, View } from "react-native";
import BooleanInput from "./BooleanInput";
import { useTheme } from "../../../hooks/use-theme-provider";
import { ToggleButtonField, StandardFieldProps, FieldNode } from "../../../constants/NodeTypes";

export default function BooleanInputField({
  template,
  id,
  fieldKey,
  defaultShown,
  field,
  locked = false,
  onChange,
}: StandardFieldProps<ToggleButtonField>) {
  const theme = useTheme();

  const displayedValue = field.value ?? false;

  function handleChange(selected: boolean) {
    onChange?.(
      template,
      defaultShown,
      {
        id: id,
        type: "field",
        field: {
          ...field,
          selected: selected,
        },
      } as FieldNode
    );
  }

  return (
    <View style={[theme.sizes.default.container]}>
      <Text style={[theme.sizes.default.text, { color: theme.colors.text, fontFamily: theme.fonts?.regular.fontFamily }]}>
        {fieldKey}
      </Text>

      <BooleanInput
        selected={field.value}
        label={field.label}
        value={displayedValue}
        locked={locked}
        onChange={handleChange}
      />
    </View>
  );
}