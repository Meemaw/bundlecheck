import chalk from 'chalk';

const stdout = console.log;
const stderr = console.error;

const error = (message: string) => {
  stderr(chalk.red(`[ERROR] ${message}`));
};

const pass = (messsage: string) => {
  stdout(chalk.green(`[PASS] ${messsage}`));
};

const warn = (message: string) => {
  stdout(chalk.yellow(`[WARNING] ${message}`));
};

export default {
  error,
  pass,
  warn,
};
