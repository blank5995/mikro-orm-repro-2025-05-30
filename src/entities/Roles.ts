import { EntitySchema, type Opt, PrimaryKeyProp } from '@mikro-orm/core';

export class Roles {
  [PrimaryKeyProp]?: 'key';
  key!: string;
  name!: string;
  createdAt!: Date & Opt;
  updatedAt!: Date & Opt;
  rowStatus: RolesRowStatus & Opt = RolesRowStatus.ENABLED;
}

export enum RolesRowStatus {
  ENABLED = 'enabled',
  DISABLED = 'disabled',
  ARCHIVED = 'archived',
  DELETED = 'deleted',
}

export const RolesSchema = new EntitySchema({
  class: Roles,
  properties: {
    key: { primary: true, type: 'string', length: 64 },
    name: { type: 'string', length: 256 },
    createdAt: { type: 'datetime', defaultRaw: `CURRENT_TIMESTAMP` },
    updatedAt: { type: 'datetime', defaultRaw: `CURRENT_TIMESTAMP` },
    rowStatus: { enum: true, items: () => RolesRowStatus },
  },
});
