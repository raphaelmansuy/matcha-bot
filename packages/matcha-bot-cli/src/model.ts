export type ArgumentType = string | number

export type Argument = {
  type: ArgumentType
  name: string
  description?: string
}

/**
 * A command
 */
export type Action = {
  name?: string
  description?: string
  args?: Argument[]
}

/**
 */
export type ActionGenerate = Action & {
  type: "template"
  /**
   * The source file template
   */
  sourceTemplate: string
  /**
   * The fileName of the genated file
   */
  outFile: string
}

export type Command = {
  name: string
  args: Argument[]
  actions: (ActionGenerate|Action)[]
}

export type Commands = Record<string,Command>



