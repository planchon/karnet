'use client';

import { FocusManager } from '@/lib/focus-manager';
import { ChatStore } from './chat.store';
import { CommandStore } from './command.store';
import { DiagramStore } from './diagram.store';
import { PaperStore } from './paper.store';
import { SettingsStore } from './settings.store';
import { SketchesStore } from './skeches.store';
import { TaskStore } from './task.store';
import { UserStore } from './user.store';
import { ViewStore } from './view.store';

export class RootStore {
    // data store
    paperStore: PaperStore;
    sketchesStore: SketchesStore;
    diagramStore: DiagramStore;
    userStore: UserStore;
    taskStore: TaskStore;
    chatStore: ChatStore;

    focusManager: FocusManager;

    // filter over the data store
    viewStore: ViewStore;

    // non persistent store
    settingsStore: SettingsStore;
    commandStore: CommandStore;

    constructor() {
        this.paperStore = new PaperStore(this);
        this.sketchesStore = new SketchesStore(this);
        this.diagramStore = new DiagramStore(this);
        this.userStore = new UserStore(this);
        this.taskStore = new TaskStore(this);
        this.chatStore = new ChatStore();
        this.viewStore = new ViewStore(this);

        this.settingsStore = new SettingsStore(this);
        this.commandStore = new CommandStore(this);

        this.focusManager = new FocusManager();
    }
}

export const rootStore = new RootStore();
