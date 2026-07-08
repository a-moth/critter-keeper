/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */
// constants/theme.ts

import {
  TextStyle,
  ViewStyle,
  ImageStyle,
} from "react-native";

const tintColorLight = "#81a77f";
const tintColorDark = "#50756b";

export const Colors = {
  light: {
    text: "#11181C",
    background: "#d3d3d3",
    card: "#ffffff",
    border: "#cfcfcf",
    primary: tintColorLight,
    icon: "#687076",
    notification: tintColorLight,
    tabIconDefault: "#687076",
    tabIconSelected: tintColorLight,
  },

  dark: {
    text: "#ECEDEE",
    background: "#151718",
    card: "#202325",
    border: "#303336",
    primary: tintColorDark,
    icon: "#9BA1A6",
    notification: tintColorDark,
    tabIconDefault: "#9BA1A6",
    tabIconSelected: tintColorDark,
  },
}

export const Sizes = {
  default: {
    container: {
      marginVertical: 8,
      marginLeft: 2,
    } as ViewStyle,

    row: {
      flexDirection: "row",
      flexWrap: "wrap",
    } as ViewStyle,

    column: {
      flexDirection: "column",
      flexWrap: "wrap"
    } as ViewStyle,

    alignCenter: {
      alignItems: "center",
      justifyContent: "center",
    } as ViewStyle,

    button: {
      paddingVertical: 15,
      paddingHorizontal: 30,
      borderRadius: 10,
    } as ViewStyle,

    regularButton: {
      borderWidth: 1,
    } as ViewStyle,

    imageButton: {
      borderRadius: 10,
    } as ViewStyle,

    buttonText: {
      fontSize: 18,
      fontWeight: "bold",
    } as TextStyle,

    textCenter: {
      textAlign: "center",
    } as TextStyle,

    listMinItem: {
      minWidth: 800,
      minHeight: 80,
    },

    fillContainer: {
        minHeight: 100,
        minWidth: "100%",
    } as ViewStyle,

    image: {
      borderWidth: 0,
      borderRadius: 6,
      marginHorizontal: 4,
    } as ImageStyle,

    input: {
      borderWidth: 1,
      borderRadius: 6,
      fontSize: 16,
      minHeight: 60,
      paddingLeft: 15,
      paddingRight: 15,
    } as TextStyle,

    text: {
      padding: 15,
      fontSize: 16,
      minHeight: 40,
    } as TextStyle,

    bold: {
      fontWeight: "bold",
    } as TextStyle,

    currentContainerStyle: {
      padding: 16,
      minHeight: "100%",
    } as ViewStyle,

    entryListContainer: {
      flex: .3 / 2,
      minHeight: "auto",
    } as ViewStyle,

    entryEditButton: {
      flex: .1,
    } as ViewStyle,

    entryViewer: {
      flex: .5,
    },

    dropdownButtonStyle: {
      width: 200,
      height: 50,
      backgroundColor: "#a1a1a1",
      borderRadius: 12,
      flexDirection: "row",
      justifyContent: "center",
      alignItems: "center",
      paddingHorizontal: 12,
    },
    dropdownButtonTxtStyle: {
      flex: 1,
      fontSize: 18,
      fontWeight: "500",
      color: "#151E26",
    },
    dropdownButtonArrowStyle: {
      fontSize: 28,
    },
    dropdownButtonIconStyle: {
      fontSize: 28,
      marginRight: 8,
    },
    dropdownMenuStyle: {
      backgroundColor: "#E9ECEF",
      borderRadius: 8,
    },
    dropdownItemStyle: {
      width: "100%",
      flexDirection: "row",
      paddingHorizontal: 12,
      justifyContent: "center",
      alignItems: "center",
      paddingVertical: 8,
    },
    dropdownItemTxtStyle: {
      flex: 1,
      fontSize: 18,
      fontWeight: "500",
      color: "#151E26",
    },
    dropdownItemIconStyle: {
      fontSize: 28,
      marginRight: 8,
    },
  },
};

export type AppColors = typeof Colors;

export type AppSizes =
  typeof Sizes.default;

export type ThemeContextType = {
  fonts: any;
  dark: boolean;
  colors: typeof Colors.light | typeof Colors.dark;
  sizes: AppSizes;
  toggleTheme: () => void;
};

export function buildTheme(
  mode: "light" | "dark",
  size: "default"
): ThemeContextType {
  const colors = Colors[mode];
  const sizes = Sizes[size];
  return {
    dark: mode === "dark",
    toggleTheme: () => {
      
    },
    fonts: "",
    colors: colors,
    sizes: sizes,
  }
}

//todo: fill in size constraints for each size