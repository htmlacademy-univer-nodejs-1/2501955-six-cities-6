import { CommandParser } from './utils/command-parser.util.js';
import { CommandName } from './commands/enums/command-name.enum.js';
import { ICommand } from './commands/interfaces/command.interface.js';

type CommandCollection = Record<string, ICommand>;

export class CLIApplication {
  private readonly _commands: CommandCollection = {};

  constructor(
    private readonly _defaultCommand: CommandName = CommandName.Help
  ) {}

  public registerCommands(commandList: ICommand[]): void {
    commandList.forEach((command) => {
      const commandName: string = command.getName();

      if (Object.hasOwn(this._commands, commandName)) {
        throw new Error(`Command ${commandName} is already registered.`);
      }
      this._commands[commandName] = command;
    });
  }

  public async processCommand(argv: string[]): Promise<void> {
    const parsedCommand = CommandParser.parse(argv);
    const [commandName] = Object.keys(parsedCommand);
    const command = this.getCommand(commandName);
    const commandArguments = parsedCommand[commandName] ?? [];
    await command.execute(...commandArguments);
  }

  private getCommand(commandName: string): ICommand {
    return this._commands[commandName] ?? this.getDefaultCommand();
  }

  private getDefaultCommand(): ICommand | never {
    if (!this._commands[this._defaultCommand]) {
      throw new Error(`The default command (${this._defaultCommand}) is not registered.`);
    }
    return this._commands[this._defaultCommand];
  }
}
