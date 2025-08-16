import type { AgentModel } from '@/models/agent.model';
import { AbstractView } from './abstract.view';

export class AgentView extends AbstractView<AgentModel> {
  order = 'createdAt';
  filters: Record<string, string> = {};
  groups: Record<string, string> = {};
  display: string[] = ['id', 'name', 'createdAt'];

  get getAllItems(): AgentModel[] {
    console.log("items", this.rootStore.agentStore.allModels);
    return this.rootStore.agentStore.allModels;
  }

  orderBy(items: AgentModel[]): AgentModel[] {
    return items;
  }

  search(items: AgentModel[]): AgentModel[] {
    return items.filter((item) =>
      item.name.toLowerCase().includes(this.query.toLowerCase())
    );
  }

  filterBy(items: AgentModel[]): AgentModel[] {
    return items;
  }

  displayColumns(): string[] {
    return this.display;
  }

  groupBy(items: AgentModel[]): Record<string, AgentModel[]> {
    return {
      all: items,
    };
  }
}
