import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, ReactNode, useContext, useEffect, useMemo, useState } from "react";

interface SettingsDataType {
  settings: Record<string, string>;
}

const SettingsData: SettingsDataType = {
  settings: {
    "**customGreeting": "Welcome to ",
    "**dayStartTime": "5:00AM",
    "**dayFormat": "DD of MMM YYYY",
    "**timeFormat": "HH:MMTT",
    "**appNickname": "your journal",
    "**selfNickname": "universe",
    "**settingsFolder": "~/Documents",
    "**colourScheme": "dark",
    "**listEntryCount": "2",
    "**showCount": "6",
    "*reloadPurchases": "show",
    "*unlockThemes": "show",
    "*unlockAPI": "show",
    "*unlockSlots": "show",
    "UUID": "49d569a5-31f4-4695-8895-f214124d89a0",
  },
};

const SettingsContext = createContext<{
  settings: Record<string, string>;
  updateSetting: (updates: Record<string, any>) => void;
  loading: boolean;
} | null>(null);

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadSettings() {
      const loaded: Record<string, string> = {};

      // Load base settings
      for (const key in SettingsData.settings) {
        const stored = await AsyncStorage.getItem("@" + key);
        loaded[key] = stored ?? SettingsData.settings[key];
      }

      setSettings(loaded);
      setLoading(false);
    }

    loadSettings();
  }, []);

  const updateSetting = React.useCallback(async (updates: Record<string, any>) => {
    setSettings(prev => {
      const next = { ...prev, ...updates };
      if (JSON.stringify(prev) === JSON.stringify(next)) return prev;
      return next;
    });

    await Promise.all(
      Object.entries(updates).map(([k, v]) =>
        AsyncStorage.setItem("@" + k, v === null ? "" : v)
      )
    );
  }, []);

  const value = useMemo(() => ({ settings, updateSetting, loading }), [settings, loading, updateSetting]);

  return <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>;
}

export function useSettings() {
  const context = useContext(SettingsContext);
  if (!context) throw new Error("useSettings must be used within a SettingsProvider");
  return context;
}