#!/usr/bin/env node
import 'reflect-metadata';
import dotenv from 'dotenv';
import { CLIApplication, GenerateCommand, HelpCommand, ImportCommand, VersionCommand } from './cli/index.js';

async function bootstrap(): Promise<void> {
  const cliApplication: CLIApplication = new CLIApplication();
  cliApplication.registerCommands([
    new HelpCommand(),
    new VersionCommand(),
    new ImportCommand(),
    new GenerateCommand()
  ]);

  await cliApplication.processCommand(process.argv);
}

dotenv.config();
bootstrap();
