import { rootStore } from "@/stores/root.store";

export const useStores = () => rootStore;

export const useSettings = () => rootStore.settingsStore;
