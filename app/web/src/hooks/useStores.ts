import { SettingsModel } from "@/models/settings.model";
import { rootStore } from "@/stores/root.store";

export const useStores = () => {
  return rootStore;
};

export function useSettings(): SettingsModel {
  return rootStore.settingsStore.getCurrent();
}

export const useUserStore = () => {
  return rootStore.userStore;
};
