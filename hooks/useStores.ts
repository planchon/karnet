import { rootStore } from "@/stores/root.store";

export const useStores = () => rootStore;

export const useUserStore = () => rootStore.userStore;

export const useSettings = () => rootStore.settingsStore;
