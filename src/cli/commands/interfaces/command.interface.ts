export interface ICommand {
  getName(): string;
  execute(...params: string[]): Promise<void> | void;
}
