import { defineConfig } from '@mikro-orm/postgresql';
import { EntityGenerator } from '@mikro-orm/entity-generator';
import { parseConnectionString } from '#helpers.ts';
import { DB_URL } from '#env.ts';

const connectionInfo = parseConnectionString(DB_URL);
const mikroOrmConfig = defineConfig(
  {
    ...connectionInfo,
    extensions: [EntityGenerator],
    entities: [],
    schema: 'public',
    baseDir: 'src',
    strict: true,
    discovery:
    {
      warnWhenNoEntities: false,
    },
    entityGenerator:
    {
      path: 'src/entities',
      entitySchema: true,
      schema: 'public',
      save: true,
      esmImport: false,
      onInitialMetadata: (metadata) =>
      {
        for (const meta of metadata)
        {
          for (const prop of meta.props)
          {
            if (prop.columnTypes.includes('public.db_row_status'))
            {
              prop.type = 'RowStatus';
              prop.runtimeType = 'RowStatus';
              prop.nativeEnumName = 'RowStatus';
            }
          }
        }
      },
      onImport: (name, basePath, extension, fileName) =>
      {
        if (name === 'RowStatus' || name === 'RowStatusType')
        {
          return { path: '#enums/RowStatus.ts', name };
        }
      },
    }
  });

const entityGeneratorConfig = mikroOrmConfig.entityGenerator;
if (!entityGeneratorConfig)
{
  throw new Error('Entity generator configuration not found.');
}

const entitiesPath = entityGeneratorConfig?.path;
if (!entitiesPath)
{
  throw new Error('Entity generator configuration missing path.');
}

type Config = typeof mikroOrmConfig;

const resolvedConfig = mikroOrmConfig as Omit<Config, 'entityGenerator'> &
{
  entityGenerator: Omit<typeof entityGeneratorConfig, 'path'> &
  {
    path: string;
  };
};

export default resolvedConfig;
