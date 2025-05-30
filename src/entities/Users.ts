import { EntitySchema, type Opt } from '@mikro-orm/core';

export class Users {
  id!: string;
  email!: string;
  createdAt!: Date & Opt;
  updatedAt!: Date & Opt;
  rowStatus: UsersRowStatus & Opt = UsersRowStatus.ENABLED;
}

export enum UsersRowStatus {
  ENABLED = 'enabled',
  DISABLED = 'disabled',
  ARCHIVED = 'archived',
  DELETED = 'deleted',
}

export const UsersSchema = new EntitySchema({
  class: Users,
  properties: {
    id: { primary: true, type: 'uuid' },
    email: { type: 'string', length: 256 },
    createdAt: { type: 'datetime', defaultRaw: `CURRENT_TIMESTAMP` },
    updatedAt: { type: 'datetime', defaultRaw: `CURRENT_TIMESTAMP` },
    rowStatus: { enum: true, items: () => UsersRowStatus },
  },
});
