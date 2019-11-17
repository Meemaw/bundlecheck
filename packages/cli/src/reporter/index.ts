import { pack as jsonpack } from 'jsonpack';

import { AnalyzeResult, ProcessedFile } from '../types';

const BUNDLECHECK_BASE_URL = 'https://d37z1ewx4b4e2v.cloudfront.net';

export function report(processedFiles: ProcessedFile[], result: AnalyzeResult) {
  const infoPayload = jsonpack({
    files: processedFiles,
  });

  const bundleInfoUrl = `${BUNDLECHECK_BASE_URL}/bundle?info=${encodeURIComponent(infoPayload)}`;

  console.log(bundleInfoUrl);
}
