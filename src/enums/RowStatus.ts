/*
NOTE:
This is the ideal shared enum definition, because typescript enum is not supported by native node execution.
Making this work is another issue.

const RowStatus =
{
  ENABLED: 'enabled',
  DISABLED: 'disabled',
  ARCHIVED: 'archived',
  DELETED: 'deleted',
} as const;

type RowStatusType = (typeof RowStatus)[keyof typeof RowStatus];

export { RowStatus };
export type { RowStatusType };

*/

export enum RowStatus
{
  ENABLED = 'enabled',
  DISABLED = 'disabled',
  ARCHIVED = 'archived',
  DELETED = 'deleted',
}