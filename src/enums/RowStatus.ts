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
