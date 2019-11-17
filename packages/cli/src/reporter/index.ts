import { pack as jsonpack } from 'jsonpack';
import Octokit from '@octokit/rest';

import { AnalyzeResult, ProcessedFile } from '../types';
import { generateCheckOutput } from './output';
import { getCIVariables } from '../ci';
import logger from '../logger';

type ReportOptions = {
  processedFiles: ProcessedFile[];
  analyzeResult: AnalyzeResult;
  githubToken: string;
  checkName?: string;
  bundlecheckBaseUrl?: string;
};

export function report({
  processedFiles,
  analyzeResult,
  githubToken,
  checkName = 'bundlecheck',
  bundlecheckBaseUrl = 'https://d37z1ewx4b4e2v.cloudfront.net',
}: ReportOptions) {
  const infoPayload = jsonpack({ files: processedFiles });
  const bundleInfoUrl = `${bundlecheckBaseUrl}/bundle?info=${encodeURIComponent(infoPayload)}`;
  const conclusion = analyzeResult.bundleFail ? 'failure' : 'success';
  const checkOutput = generateCheckOutput(analyzeResult, bundleInfoUrl);

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
    name: checkName,
    head_sha: commitSHA,
    status: 'completed',
    conclusion,
    details_url: bundleInfoUrl,
    output: checkOutput,
  });
}
