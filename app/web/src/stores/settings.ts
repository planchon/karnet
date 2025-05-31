import { proxy } from "valtio";

interface SettingsState {
  theme: "light" | "dark";
}

export const settingsStore = proxy<SettingsState>({
  theme: "light"
});

export const toggleTheme = (theme: "light" | "dark") => {
  settingsStore.theme = theme;
  document.documentElement.classList.toggle("dark", theme === "dark");
};
