import { MikroORM } from "@mikro-orm/postgresql";
import { handleNodeExec } from '#helpers.ts';
import config from '#config/mikro-orm.config.ts';

handleNodeExec(import.meta, async(args) =>
{
  const orm = await MikroORM.init(config);

  const runInternal = async() =>
  {
    if (args.includes('--dump'))
    {
      console.log(await orm.entityGenerator.generate({ ...config.entityGenerator, save: false }));
      return;
    }

    await orm.entityGenerator.generate(config.entityGenerator);
    console.log(`Entities generated into: ${config.entityGenerator.path}`);
  };

  try
  {
    console.log(`Connecting to: ${config.dbName}@${config.host}:${config.port} as ${config.user}`);

    await runInternal();
  }
  catch (error)
  {
    console.error(error);
  }
  finally
  {
    await orm.close(true);
  }
});
