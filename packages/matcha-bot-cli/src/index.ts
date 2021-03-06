import { Configuration } from "./model";
import { program } from "commander";
import { version } from "./version";

import { printBanner } from "./banner";
import { getConfiguration } from "./config/config-reader";

import { registerGenerators } from "./commands/register-commands";
import { listGenerators } from "./commands/list-generators";
import { initCommand } from "./commands/init-command";
import { registerPrompts } from "./commands/register-prompts";

import { checkUpdate } from "./utils/check-update";
import { configDir } from "./config/config-reader";
/**
 * Entry point
 */
export const run = async () => {
  // print banner
  printBanner("Matcha Bot");

  // read configuration
  const config: Configuration = await getConfiguration();

  // check update
  checkUpdate();

  // Register prompt types
  registerPrompts();

  // Register commands based on available configuration
  registerGenerators(config);

  // Program definition
  program
    .version(version, "-v,--version", "output the current version")
    // Register a command that lists all availables commands
    .command("list")
    .description("👉 list all available generators")
    .action(() => listGenerators(config.generators));
  // Register init command => copy a starter directory called .matchabot
  program
    .command("init")
    .description(
      `👉 create a local template directory '${configDir}' in your current directory with a set of starter templates`
    )
    .action(initCommand);

  program.parse(process.argv);
};

/* run the program */

run()
  .then(() => {})
  .catch((e) => {
    console.error(e);
  });
