import path from 'path';
import { fileURLToPath } from 'url';

/**
 * Determines if the current module is being run directly as a script.
 */
const isRunningAsScript =
(importMeta: ImportMeta) =>
{
  const pathToFile = path.resolve(fileURLToPath(importMeta.url));
  const pathPassedToNode = path.resolve(process.argv[1] as string);

  return pathToFile.includes(pathPassedToNode);
};

/**
 * Executes a callback if the current module is being run directly as a script.
 */
const handleNodeExec =
(importMeta: ImportMeta, callback: (args: string[]) => void) =>
{
  if (isRunningAsScript(importMeta))
  {
    callback(process.argv.slice(2));
  }
};

const parseConnectionString =
(connectionString: string): { host: string; port: number; user: string; password: string; dbName: string } =>
{
  const url = new URL(connectionString);
  const result =
  {
    host: url.hostname,
    port: parseInt(url.port),
    user: url.username,
    password: url.password,
    dbName: url.pathname.slice(1),
  };

  return result;
};

export { handleNodeExec, parseConnectionString };