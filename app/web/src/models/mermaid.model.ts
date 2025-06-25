import { makeObservable, observable, reaction } from "mobx";
import { AbstractModel } from "./abstract.model";

export class Mermaid extends AbstractModel {
  content: string = `sequenceDiagram
    Consumer-->API: Book something
    API-->BookingService: Start booking process
    break when the booking process fails
        API-->Consumer: show failure
    end
    API-->BillingService: Start billing process
  `;

  constructor(props: Partial<Mermaid> & { id: string }) {
    super(props);

    makeObservable(this, {
      content: observable
    });

    reaction(
      () => this.toJSON(),
      () => {
        this.save();
      },
      {
        delay: 1000
      }
    );
  }

  toJSON() {
    return {
      ...this
    };
  }

  _id() {
    return `p6n-mermaid-${this.id}`;
  }
}
