import { EntitySchema, type Opt, PrimaryKeyProp } from '@mikro-orm/core';
import { Domains } from './Domains';
import { Roles } from './Roles';
import { Users } from './Users';

export class UserRoles {
  [PrimaryKeyProp]?: ['domain', 'user'];
  domain!: Domains;
  user!: Users;
  role!: Roles;
  createdAt!: Date & Opt;
  updatedAt!: Date & Opt;
  rowStatus: UserRolesRowStatus & Opt = UserRolesRowStatus.ENABLED;
}

export enum UserRolesRowStatus {
  ENABLED = 'enabled',
  DISABLED = 'disabled',
  ARCHIVED = 'archived',
  DELETED = 'deleted',
}

export const UserRolesSchema = new EntitySchema({
  class: UserRoles,
  properties: {
    domain: {
      primary: true,
      kind: 'm:1',
      entity: () => Domains,
      deleteRule: 'cascade',
    },
    user: {
      primary: true,
      kind: 'm:1',
      entity: () => Users,
      deleteRule: 'cascade',
    },
    role: { kind: 'm:1', entity: () => Roles, deleteRule: 'cascade' },
    createdAt: { type: 'datetime', defaultRaw: `CURRENT_TIMESTAMP` },
    updatedAt: { type: 'datetime', defaultRaw: `CURRENT_TIMESTAMP` },
    rowStatus: { enum: true, items: () => UserRolesRowStatus },
  },
});
