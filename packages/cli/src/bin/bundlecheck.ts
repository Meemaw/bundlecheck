#!/usr/bin/env node

import program from 'commander';

import { getConfig } from '../config';
import { processFiles } from '../compress';
import { analyzeFiles } from '../analyze';
import { report } from '../reporter';
import logger from '../logger';
import { isCI } from '../ci';

program.option('-c|--config [config]', 'Path to configuration file').parse(process.argv);

try {
  const config = getConfig({ configPath: program.config });
  const processedFiles = processFiles(config);
  const analyzeResult = analyzeFiles(processedFiles);

  if (isCI()) {
    report(processedFiles, analyzeResult);
  }
} catch (error) {
  logger.error(error.message);
  process.exit(1);
}
