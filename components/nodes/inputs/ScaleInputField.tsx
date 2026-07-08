import { useState } from "react";
import { Text, View } from "react-native";
import BooleanImageInput from "./BooleanImageInput";
import { useTheme } from "../../../hooks/use-theme-provider";
import { ScaleField, StandardFieldProps } from "../../../constants/nodeTypes";

export default function ScaleInputField({
  template,
  id,
  fieldKey,
  field,
  onChange,
  locked = false,
}: StandardFieldProps<ScaleField>) {
  const theme = useTheme();

  // 0 = nothing selected
  const [which, setWhich] = useState<number>(field.value);

  const handleSelect = (selection: number) => {
    const nextValue = which === selection ? 0 : selection;

    setWhich(nextValue);

    onChange?.(
      template,
      locked,
      {
        id: id,
        type: "field",
        field: {
          id: id,
          type: "scale",
          field: field,
          imageBased: true,
          min: field.min,
          max: field.max,
          value: nextValue,
          label: field.label,
          visible: field.visible
        } as ScaleField
      }
    );
  };

  const images = [
    require("../../../assets/images/1.png"),
    require("../../../assets/images/2.png"),
    require("../../../assets/images/3.png"),
    require("../../../assets/images/4.png"),
    require("../../../assets/images/5.png"),
  ];

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

      <View id={fieldKey} style={theme.sizes.default.row}>
        {images.map((image, index) => {
          const selection = index + 1;

          return (
            <BooleanImageInput
              key={selection}
              selection={selection}
              selected={which === selection}
              onPress={() =>
                handleSelect(selection)
              }
              imageSrc={image}
              imageSrcFalse={image}
            />
          );
        })}
      </View>
    </>
  );
}