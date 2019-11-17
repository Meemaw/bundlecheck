#!/usr/bin/env node

import program from 'commander';

import { getConfig } from '../config';
import { processFiles } from '../compress';
import { analyzeFiles } from '../analyze';
import { report } from '../reporter';
import logger from '../logger';
import { isCI } from '../ci';

program
  .option('-c|--config [config]', 'Path to configuration file')
  .option('-n|--checkName [checkName]', 'Name of Github Check')
  .option('-b|--baseURL [baseURL]', 'Bundlecheck base URL')
  .parse(process.argv);

try {
  const config = getConfig({ configPath: program.config });
  const processedFiles = processFiles(config);
  const analyzeResult = analyzeFiles(processedFiles);

  if (isCI()) {
    const githubToken = process.env.BUNDLECHECK_GITHUB_TOKEN;
    if (!githubToken) {
      logger.warn(`CI environment detected but BUNDLECHECK_GITHUB_TOKEN is not defined.
  
  You can read about the configuration options here:
  https://github.com/Meemaw/bundlecheck#configuration`);
    } else {
      report({
        processedFiles,
        analyzeResult,
        githubToken,
        checkName: program.checkName,
        bundlecheckBaseUrl: program.baseURL,
      });
    }
  }
} catch (error) {
  logger.error(error.message);
  process.exit(1);
}
