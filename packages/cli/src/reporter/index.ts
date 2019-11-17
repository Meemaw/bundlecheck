import { pack as jsonpack } from 'jsonpack';
import Octokit from '@octokit/rest';

import { AnalyzeResult, ProcessedFile } from '../types';
import { generateCheckOutput } from './output';
import { getCIVariables } from '../ci';
import logger from '../logger';

const APP_NAME = 'bundlecheck';
const BUNDLECHECK_BASE_URL = 'https://d37z1ewx4b4e2v.cloudfront.net';

export function report(processedFiles: ProcessedFile[], result: AnalyzeResult) {
  const infoPayload = jsonpack({ files: processedFiles });
  const bundleInfoUrl = `${BUNDLECHECK_BASE_URL}/bundle?info=${encodeURIComponent(infoPayload)}`;
  const conclusion = result.bundleFail ? 'failure' : 'success';
  const checkOutput = generateCheckOutput(result, bundleInfoUrl);

  const githubToken = process.env.BUNDLECHECK_GITHUB_TOKEN;
  if (!githubToken) {
    logger.warn(`CI environment detected but BUNDLECHECK_GITHUB_TOKEN is not defined.

    You can read about the configuration options here:
    https://github.com/Meemaw/bundlecheck#configuration`);
    return;
  }

  const { repo, owner, commitSHA } = getCIVariables();

  return new Octokit({ auth: githubToken }).checks.create({
    owner,
    repo,
    name: APP_NAME,
    head_sha: commitSHA,
    status: 'completed',
    conclusion,
    details_url: bundleInfoUrl,
    output: checkOutput,
  });
}
