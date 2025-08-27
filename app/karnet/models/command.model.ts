import { makeAutoObservable } from 'mobx';

export class CommandsModels {
  helpOpen = false;
  commandKOpen = false;
  eventOpen = false;
  chatOpen = false;
  taskOpen = false;
  projectOpen = false;

  lastFocus: string | null = null;

  constructor(props: Partial<CommandsModels>) {
    Object.assign(this, props);

    makeAutoObservable(this);
  }

  toggleHelp = () => {
    this.helpOpen = !this.helpOpen;
  };

  toggleCommandK = () => {
    this.commandKOpen = !this.commandKOpen;
  };

  toggleEvent = () => {
    this.eventOpen = !this.eventOpen;
  };

  toggleChat = () => {
    this.chatOpen = !this.chatOpen;
  };

  toggleTask = () => {
    this.taskOpen = !this.taskOpen;
  };

  closeTask = () => {
    this.taskOpen = false;
  };

  toggleProject = () => {
    this.projectOpen = !this.projectOpen;
  };
}
