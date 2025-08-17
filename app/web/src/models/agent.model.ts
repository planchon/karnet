import { makeObservable, observable, reaction } from 'mobx';
import { AbstractModel } from './abstract.model';

export class AgentModel extends AbstractModel {
  type = 'agent' as const;

  name = '';
  description = '';

  prompt = '';
  code = '';

  lastRun: Date = new Date();

  constructor(props: Partial<AgentModel> & { id: string }) {
    super(props);
    Object.assign(this, props);

    makeObservable(this, {
      name: observable,
      description: observable,
      prompt: observable,
      code: observable,
      lastRun: observable,
    });

    this.load();

    reaction(
      () => this.toJSON(),
      () => {
        this.save();
      },
      {
        delay: 1000,
      }
    );
  }

  getSmallId(id: number): string {
    return `AGENT-${id}`;
  }

  toJSON() {
    return {
      ...this,
    };
  }

  _id(): string {
    return `p6n-agent-${this.id}`;
  }
}
