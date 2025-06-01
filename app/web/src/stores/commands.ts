import { proxy } from "valtio";

interface CommandEventsState {
  helpOpen: boolean;
  commandKOpen: boolean;
  eventOpen: boolean;
  chatOpen: boolean;
  taskOpen: boolean;
  projectOpen: boolean;
}

export const commandEventsStore = proxy<CommandEventsState>({
  helpOpen: false,
  commandKOpen: false,
  eventOpen: false,
  chatOpen: false,
  taskOpen: false,
  projectOpen: false
});

export const toggleHelp = () => {
  commandEventsStore.helpOpen = !commandEventsStore.helpOpen;
};

export const closeCommandK = () => {
  commandEventsStore.commandKOpen = false;
};

export const toggleCommandK = () => {
  commandEventsStore.commandKOpen = !commandEventsStore.commandKOpen;
};

export const toggleCreateEvents = () => {
  commandEventsStore.eventOpen = !commandEventsStore.eventOpen;
};

export const toggleCreateChat = () => {
  commandEventsStore.chatOpen = !commandEventsStore.chatOpen;
};

export const toggleCreateTask = () => {
  commandEventsStore.taskOpen = !commandEventsStore.taskOpen;
};

export const toggleCreateProject = () => {
  commandEventsStore.projectOpen = !commandEventsStore.projectOpen;
};
