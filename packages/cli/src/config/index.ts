import fs from 'fs';
import path from 'path';
import { cosmiconfigSync } from 'cosmiconfig';

import { FileConfig } from '../types';

type GetConfigOptions = {
  configPath?: string;
};

export function getConfig({ configPath }: GetConfigOptions): FileConfig[] {
  const configPaths = ['package.json'];

  if (configPath) {
    if (!fs.existsSync(configPath)) {
      throw new Error(`Custom config file does not exist. Make sure the path is relative to the project root.
        
    You can read about the configuration options here:
    https://github.com/Meemaw/bundlecheck#configuration`);
    }
    configPaths.push(configPath);
  } else {
    configPaths.push('bundlecheck.config.json');
  }

  const explorer = cosmiconfigSync('bundlecheck', { searchPlaces: configPaths });
  const result = explorer.search();

  if (!result) {
    throw new Error(`Config not found.
  
    You can read about the configuration options here:
    https://github.com/Meemaw/bundlecheck#configuration`);
  }

  if (path.parse(result.filepath).base === 'package.json') {
    return result.config;
  }

  return result.config.files;
}
