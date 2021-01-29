import { generate } from "../template-generator/generator"
import { getCommands, askCommandArgs, getArgs } from "./commands-util"
import { Commands } from "../model"
import { program } from "commander"
import { getSystemVariables } from "../template-generator/add-system-variables"
import path from "path"

const log = console.log

/**
 * Register a list of commands
 * @param commands
 */
export const registerCommands = (commands: Commands) =>
  getCommands(commands).map((command) => {
    const cmd = program.command(command.name)

    // Force option
    cmd.option("--force", "force overwrite file if file already exists")
    // Debug mode
    cmd.option(
      "--debug",
      "execute the command in debug mode (no file generated)"
    )

    command.args.map((args) => {
      const optionName = args.name
      const optionFlag = args.alias ?? args.name.toLocaleLowerCase().slice(0, 1)
      const option = `-${optionFlag}, --${optionName} <${optionName}>`
      cmd.option(option, args.description)
      cmd.action(async function () {
        // Find args not in command line
        const args = getArgs(command)
        const opts: Record<string, unknown> = cmd.opts()
        const undefinedArgs = args.filter(
          (arg) => !Object.keys(opts).includes(arg.name)
        )
        // Ask missing args
        const resAskArgs = await askCommandArgs(undefinedArgs)
        // All commands arguments are completed
        const argValues = { ...opts, ...resAskArgs }

        // force
        const force = argValues.force === true
        const debugMode = argValues.debug === true

        // generating files
        const genActions = command.actions
        const templateDir =
          command.templateDir ?? path.join(process.cwd(), "./templates")

        // Merge with system variables (such as {___currentDateTime,__generatorVersion})
        const data = { ...argValues, ...getSystemVariables() }

        log("\r\n🍵 Generating files:\r\n")
        await generate(genActions, data, templateDir, force, debugMode)
      })
      return cmd
    })
  })
