import { handleNodeExec } from "#helpers.ts";
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

handleNodeExec(import.meta, async (args) =>
{
  const containerName = args[0];
  if (!containerName)
  {
    throw new Error("Container name is required.");
  }

  if (!dockerInstalled())
  {
    throw new Error("Docker is not installed or not in PATH.");
  }

  if (!containerExists(containerName))
  {
    console.log(`Container '${containerName}' does not exist. Nothing to delete.`);
    return;
  }

  try
  {
    console.log(`Stopping container: ${containerName}`);
    execSync(`docker stop ${containerName}`, { stdio: "inherit" });
  }
  catch (err)
  {
    console.warn(`Warning: Could not stop container (it may not be running): ${err}`);
  }

  try
  {
    console.log(`Removing container: ${containerName}`);
    execSync(`docker rm ${containerName}`, { stdio: "inherit" });
    console.log(`Container '${containerName}' removed successfully.`);
  }
  catch (err)
  {
    throw new Error(`Failed to remove container: ${err}`);
  }
});