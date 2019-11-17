import fs from 'fs';
import glob from 'glob';
import bytes from 'bytes';
import { brotliCompressSync, gzipSync } from 'zlib';

import { FileConfig, ProcessedFile } from '../types';

function getCompressedSize(data: string, compression: string = 'none'): number {
  switch (compression) {
    case 'gzip':
      return gzipSync(data).byteLength;
    case 'brotli':
      return brotliCompressSync(data).byteLength;
    case 'none':
      return Buffer.byteLength(data);
    default:
      throw new Error(`Unsupported compression: ${compression}`);
  }
}

export function processFiles(config: FileConfig[]): ProcessedFile[] {
  const analyzedFiles: ProcessedFile[] = [];

  return config.reduce((acc, fileConfig) => {
    const paths = glob.sync(fileConfig.path);
    if (paths.length === 0) {
      throw new Error(`There is no matching file for ${fileConfig.path} in ${process.cwd()}`);
    }

    const compression = fileConfig.compression || 'none';

    const globAnalyzedFiles = paths.map(path => {
      const maxSize = bytes(fileConfig.maxSize) || Infinity;
      const fileContents = fs.readFileSync(path, 'utf8');
      const size = getCompressedSize(fileContents, compression);
      return { maxSize, size, path, compression };
    });

    return [...acc, ...globAnalyzedFiles];
  }, analyzedFiles);
}
