export class AbstractModel {
  id: string = crypto.randomUUID();
  createdAt: Date = new Date();
  updatedAt: Date = new Date();
  deletedAt: Date | null = null;
  isDeleted: boolean = false;
  isActive: boolean = true;
  isArchived: boolean = false;
  isHidden: boolean = false;

  constructor(props: Partial<AbstractModel>) {
    Object.assign(this, props);
  }
}
