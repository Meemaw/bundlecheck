import bytes from 'bytes';
import { ChecksCreateParamsOutput } from '@octokit/rest';

import { AnalyzeResult } from '../types';
import { markdownJoinLines, RED_CIRCLE, CHECKMARK } from './markdown';

export function generateCheckOutput(
  result: AnalyzeResult,
  bundleInfoUrl: string
): ChecksCreateParamsOutput {
  const prettySize = bytes(result.totalSize);
  const prettyMaxSize = bytes(result.totalMaxSize);
  const totalBundleSizeMessage = `Total bundle size is ${prettySize}/${prettyMaxSize}.`;

  const markdownTotalBundleSizeMessage = `***${totalBundleSizeMessage}***`;
  const markdownSeeDetailsMessage = `Go [here](${bundleInfoUrl}) to see more detailed report on your bundle.`;
  const markdownFileListSummary = markdownJoinLines(
    result.files.map(analyzedFile => {
      return `*1. ${analyzedFile.message} ${analyzedFile.fail ? RED_CIRCLE : CHECKMARK}*`;
    })
  );

  // no failure
  if (!result.bundleFail) {
    return {
      title: 'Eveything looks good!',
      summary: markdownJoinLines([
        `${CHECKMARK} **PASS**`,
        markdownTotalBundleSizeMessage,
        '<h2 class="f6 text-normal text-uppercase text-gray-light mb-2">Details</h2>',
        markdownFileListSummary,
        markdownSeeDetailsMessage,
      ]),
    };
  }

  const markdownFailureSummary = markdownJoinLines([
    `${RED_CIRCLE} **FAIL**`,
    markdownTotalBundleSizeMessage,
    '<h2 style="text-transform: uppercase; font-size: 12px; color: #6a737d; font-weight: 400; margin-bottom: 8px;">Details</h2>',
    markdownFileListSummary,
    markdownSeeDetailsMessage,
  ]);

  // single file -- proxy the message from analyze
  if (result.files.length === 1) {
    return { title: result.files[0].message, summary: markdownFailureSummary };
  }

  // multiple files -- 1 failure
  if (result.failureCount === 1) {
    const failingFile = result.files.find(analyzedFile => analyzedFile.fail);
    if (!failingFile) {
      throw new Error('Failed to find failing file to generate title');
    }
    return { title: failingFile.message, summary: markdownFailureSummary };
  }

  // multiple files -- all failures
  if (result.failureCount === result.files.length) {
    return { title: totalBundleSizeMessage, summary: markdownFailureSummary };
  }

  // multiple files -- multiple failures
  return {
    title: `Bundle size > maxSize for some files. ${totalBundleSizeMessage}`,
    summary: markdownFailureSummary,
  };
}
