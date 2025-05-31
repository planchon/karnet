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

export const toggleCommandEvents = () => {
  commandEventsStore.helpOpen = !commandEventsStore.helpOpen;
};

export const toggleCommandKEvents = () => {
  commandEventsStore.commandKOpen = !commandEventsStore.commandKOpen;
};

export const toggleCreateEventEvents = () => {
  commandEventsStore.eventOpen = !commandEventsStore.eventOpen;
};

export const toggleChatEvents = () => {
  commandEventsStore.chatOpen = !commandEventsStore.chatOpen;
};

export const toggleCreateTaskEvents = () => {
  commandEventsStore.taskOpen = !commandEventsStore.taskOpen;
};

export const toggleCreateProjectEvents = () => {
  commandEventsStore.projectOpen = !commandEventsStore.projectOpen;
};
