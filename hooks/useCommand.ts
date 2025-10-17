import { CommandsModels } from "@/models/command.model";

let __commandSingleton: CommandsModels | null = null;

if (!__commandSingleton) {
    __commandSingleton = new CommandsModels({});
}

export const useCommands = () => __commandSingleton;
