// touchable opacity component for boolean input data
/**
 * TODO: test component and ensure it works, presents, and is functional in the intended way
 * TODO: load loaded images in from files somehow
 */

// components/BooleanInput.tsx

import { useEffect, useState } from "react";

import {
  Image,
  TouchableOpacity,
  View,
  ImageSourcePropType,
} from "react-native";

import { useTheme } from "../../../hooks/use-theme-provider";

type BooleanInputProps = {
  selected: boolean;

  selection: number;

  imageSrcFalse: ImageSourcePropType;

  imageSrc: ImageSourcePropType;

  locked?: boolean;

  onPress: () => void;
};

export default function BooleanImageInput({
  selected,
  onPress,
  imageSrcFalse,
  imageSrc,
  locked = false,
}: BooleanInputProps) {
  const theme = useTheme();

  const [isSelected, setIsSelected] =
    useState(selected);

  // sync prop updates
  useEffect(() => {
    setIsSelected(selected);
  }, [selected]);

  function toggleSelection() {
    onPress();
  }

  const imageStyle = [
    theme.sizes.default.image,
    {
      borderColor: isSelected ? theme.colors.card : theme.colors.border,
      borderWidth: 5
    },
  ];

  if (locked) {
    return (
      <View style={theme.sizes.default.container}>
        <Image
          style={imageStyle}
          source={
            isSelected
              ? imageSrc
              : imageSrcFalse
          }
        />
      </View>
    );
  }

  return (
    <TouchableOpacity
      onPress={toggleSelection}
      style={[
        theme.sizes.default.image,
        {
          backgroundColor:
            isSelected ? theme.colors.card : theme.colors.border,
        },
      ]}
    >
      <Image
        style={imageStyle}
        source={
          isSelected
            ? imageSrc
            : imageSrcFalse
        }
      />
    </TouchableOpacity>
  );
}