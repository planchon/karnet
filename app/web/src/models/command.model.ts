import { makeAutoObservable } from "mobx";

export class CommandsModels {
  helpOpen: boolean = false;
  commandKOpen: boolean = false;
  eventOpen: boolean = false;
  chatOpen: boolean = false;
  taskOpen: boolean = false;
  projectOpen: boolean = false;

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

  toggleProject = () => {
    this.projectOpen = !this.projectOpen;
  };
}
