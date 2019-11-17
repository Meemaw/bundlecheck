import bytes from 'bytes';

import logger from '../logger';
import { ProcessedFile, AnalyzeResult } from '../types';

export function analyzeFiles(processedFiles: ProcessedFile[]): AnalyzeResult {
  let totalSize = 0;
  let totalMaxSize = 0;
  let failureCount = 0;
  let bundleFail = false;

  const analyzedFiles = processedFiles.map(processedFile => {
    let fail = false;

    const { compression, maxSize, size, path } = processedFile;

    totalSize += size;
    totalMaxSize += maxSize;

    const compressionText = `(${compression === 'none' ? 'no compression' : compression})`;
    const prettyMaxSize = bytes(maxSize);
    let message = `${path}: ${bytes(size)} `;

    if (size > maxSize) {
      bundleFail = true;
      fail = true;
      failureCount += 1;
      message += `> maxSize ${prettyMaxSize} ${compressionText}`;
      logger.error(message);
    } else {
      message += `< maxSize ${prettyMaxSize} ${compressionText}`;
      logger.pass(message);
    }

    return { fail, message };
  });

  return { failureCount, totalSize, totalMaxSize, bundleFail, files: analyzedFiles };
}
