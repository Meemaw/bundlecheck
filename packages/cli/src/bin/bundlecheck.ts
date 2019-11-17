#!/usr/bin/env node

import program from 'commander';
import chalk from 'chalk';

import { getConfig } from '../config';
import { processFiles } from '../compress';
import { analyzeFiles } from '../analyze';
import { report } from '../reporter';

program.option('-c|--config [config]', 'Path to configuration file').parse(process.argv);

try {
  const config = getConfig({ configPath: program.config });
  const processedFiles = processFiles(config);
  const analyzeResult = analyzeFiles(processedFiles);
  report(processedFiles, analyzeResult);
} catch (error) {
  console.error(chalk.red(error.message));
}
