import React, { createContext, useContext, useState } from "react";

import * as catppuccin from "@catppuccin/palette";

import { useColorScheme } from "react-native";

import { Sizes } from "../constants/theme";

const palettes = {
  light: catppuccin.flavors.latte,
  dark: catppuccin.flavors.macchiato,
};

export const DarkTheme = {
  dark: palettes.dark,
  colors: {
    primary: palettes.dark.colors.base.hex,
    background: palettes.dark.colors.surface0.hex,
    card: palettes.dark.colors.lavender.hex,
    text: palettes.dark.colors.text.hex,
    border: palettes.dark.colors.surface1.hex,
    notification: palettes.dark.colors.rosewater.hex,
  },
  sizes: Sizes,
  fonts: {
    regular: { fontFamily: "Inter-Regular", fontWeight: "normal" },
    medium: { fontFamily: "Inter-Medium", fontWeight: "normal" },
    bold: { fontFamily: "Inter-Bold", fontWeight: "bold" },
    heavy: { fontFamily: "Inter-Black", fontWeight: "bold" },
  },
};

export const LightTheme = {
  dark: palettes.light,
  colors: {
    primary: palettes.light.colors.base.hex,
    background: palettes.light.colors.surface0.hex,
    card: palettes.light.colors.lavender.hex,
    text: palettes.light.colors.text.hex,
    border: palettes.light.colors.surface1.hex,
    notification: palettes.light.colors.rosewater.hex,
  },
  sizes: Sizes,
  fonts: {
    regular: { fontFamily: "Inter-Regular", fontWeight: "normal" },
    medium: { fontFamily: "Inter-Medium", fontWeight: "normal" },
    bold: { fontFamily: "Inter-Bold", fontWeight: "bold" },
    heavy: { fontFamily: "Inter-Black", fontWeight: "bold" },
  },
};

const ThemeContext = createContext<typeof DarkTheme | typeof LightTheme | null>(null);

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const colorScheme = useColorScheme();
  const theme = colorScheme === "dark" ? DarkTheme : LightTheme;

  return (
    <ThemeContext.Provider value={theme}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within ThemeProvider");
  return ctx;
};