import { Stack } from "expo-router";
import { ThemeProvider } from "../hooks/use-theme-provider";

import { SettingsProvider } from "../utils/SettingsProvider";

export default function App() {
  return (
    <SettingsProvider>
      <ThemeProvider>
        <RootLayout />
      </ThemeProvider>
    </SettingsProvider>
  );
}

function RootLayout() {
  return <Stack />;
}