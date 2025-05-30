import { EntitySchema, type Opt, PrimaryKeyProp } from '@mikro-orm/core';

export class Domains {
  [PrimaryKeyProp]?: 'key';
  key!: string;
  name!: string;
  createdAt!: Date & Opt;
  updatedAt!: Date & Opt;
  rowStatus: DomainsRowStatus & Opt = DomainsRowStatus.ENABLED;
}

export enum DomainsRowStatus {
  ENABLED = 'enabled',
  DISABLED = 'disabled',
  ARCHIVED = 'archived',
  DELETED = 'deleted',
}

export const DomainsSchema = new EntitySchema({
  class: Domains,
  properties: {
    key: { primary: true, type: 'string', length: 64 },
    name: { type: 'string', length: 256 },
    createdAt: { type: 'datetime', defaultRaw: `CURRENT_TIMESTAMP` },
    updatedAt: { type: 'datetime', defaultRaw: `CURRENT_TIMESTAMP` },
    rowStatus: { enum: true, items: () => DomainsRowStatus },
  },
});
