import { Commands, Command, Argument } from "./model"
import { prompt } from "enquirer"

export const getCommands = (commands: Commands) => {
  return Object.keys(commands).map((k) => commands[k])
}

export const getArgs = (command: Command) => {
  return command.args
}

export const getCommandNames = (commands: Commands) =>
  getCommands(commands).map((c) => c.name)

export const askCommandArgs = async (args: Argument[]) => {
  // generate a list of questions
  const questions = args.map((arg) => ({
    type: "input",
    name: arg.name,
    message: arg.description ?? `${arg.name}`
  }))

  const responses: Record<string, unknown> = await prompt(questions)
  return responses
}
