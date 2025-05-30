import { DB_URL } from "#env.ts";
import { handleNodeExec, parseConnectionString } from "#helpers.ts";
import { execSync, spawnSync } from "child_process";

function dockerInstalled()
{
  try
  {
    execSync("docker --version", { stdio: "ignore" });
    return true;
  }
  catch
  {
    return false;
  }
}

function containerExists(name: string)
{
  const result = spawnSync("docker", ["ps", "-a", "--filter", `name=^/${name}$`, "--format", "{{.Names}}"]);
  return result.stdout.toString().trim() === name;
}

function containerRunning(name: string)
{
  const result = spawnSync("docker", ["ps", "--filter", `name=^/${name}$`, "--filter", "status=running", "--format", "{{.Names}}"]);
  return result.stdout.toString().trim() === name;
}

async function waitForPostgres(containerName: string, user: string, dbName: string)
{
  const maxWait = 30; // seconds
  let ready = false;
  for (let i = 0; i < maxWait; i++)
  {
    try
    {
      execSync(`docker exec ${containerName} pg_isready -U ${user} -d ${dbName}`, { stdio: 'ignore' });
      ready = true;
      break;
    }
    catch
    {
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }
  if (!ready)
  {
    console.error('Postgres did not become ready in time.');
    process.exit(1);
  }
}

handleNodeExec(import.meta, async (args) =>
{
  const containerName = args[0];
  if (!containerName)
  {
    throw new Error("Container name is required.");
  }

  const { host, port, user, password, dbName } = parseConnectionString(DB_URL);

  if (!dockerInstalled())
  {
    throw new Error("Docker is not installed or not in PATH.");
  }

  if (!containerExists(containerName))
  {
    console.log(`Creating and starting new Postgres container: ${containerName}`);
    try
    {
      execSync(
        `docker run -d --name ${containerName} -e POSTGRES_USER=${user} -e POSTGRES_PASSWORD=${password} -e POSTGRES_DB=${dbName} -p ${port}:5432 postgres:15`,
        { stdio: "inherit" }
      );
    }
    catch (err)
    {
      throw new Error(`Failed to start Postgres container: ${err}`);
    }
  }
  else if (!containerRunning(containerName))
  {
    console.log(`Starting existing Postgres container: ${containerName}`);
    try
    {
      execSync(`docker start ${containerName}`, { stdio: "inherit" });
    }
    catch (err)
    {
      throw new Error(`Failed to start existing Postgres container: ${err}`);
    }
  }
  else
  {
    console.log(`Postgres container '${containerName}' is already running.`);
  }

  const connectionString = `postgres://${user}:${password}@${host}:${port}/${dbName}`;
  console.log("Connection string:");
  console.log(connectionString);

  await waitForPostgres(containerName, user, dbName);

  // Apply migration
  console.log("Applying migration: migrations/0000_init.pgsql");
  execSync(
    `docker exec -i ${containerName} psql -U ${user} -d ${dbName} < migrations/0000_init.pgsql`,
    { stdio: "inherit" }
  );
  console.log("Migration applied successfully.");
});