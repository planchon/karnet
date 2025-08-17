import { makeObservable } from 'mobx';
import { titleAgent } from '@/data/agents/title.agent';
import { AgentModel } from '@/models/agent.model';
import { AbstractStore } from './abstract.store';
import type { RootStore } from './root.store';

export class AgentStore extends AbstractStore<AgentModel> {
  constructor(rootStore: RootStore) {
    super(rootStore);

    this.seed();

    makeObservable(this, {});
  }

  seed() {
    this.setModel('title-agent', titleAgent);
    console.log('title-agent', titleAgent);
  }

  loadInMemory(id: string | undefined): AgentModel {
    if (id === undefined) {
      throw new Error('Id is undefined');
    }
    return new AgentModel({ id });
  }

  createNewModel(id: string): AgentModel {
    const agent = new AgentModel({ id });
    agent.save();
    this.setModel(id, agent);
    this.save();
    return agent;
  }
}
