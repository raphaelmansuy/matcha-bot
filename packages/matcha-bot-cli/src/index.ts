#!/usr/bin/env node

import { Configuration } from "./model"
import { program } from "commander"
import { version } from "./version"

import { printBanner } from "./banner"
import { getConfiguration } from "./config/config-reader"

import { registerCommands } from "./commands/register-commands"
import { listCommands } from "./commands/list-command"
import { initCommand } from "./commands/init-command"
import { registerPrompts } from "./commands/register-prompts"

/**
 * Entry point
 */
export const run = async () => {
  // print banner
  printBanner("Matcha Bot")

  // read configuration
  const config: Configuration = await getConfiguration()

  // Register prompt types
  registerPrompts()

  // Register commands based on available configuration
  registerCommands(config.commands)

  // Program definition
  program
    .version(version, "-v,--version", "output the current version")
    // Register a command that lists all availables commands
    .command("list")
    .action(() => listCommands(config.commands))
  // Register init command => copy a starter directory called .matchabot
  program.command("init").action(initCommand)

  program.parse(process.argv)

//  console.log("\r\n🍵 Be happy drink tea ... matcha tea ... .\r\n")
}
