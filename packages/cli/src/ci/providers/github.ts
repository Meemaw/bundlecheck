import { RequiredCIVariables } from '../types';

export default function({
  GITHUB_ACTIONS,
  GITHUB_REPOSITORY,
  GITHUB_SHA,
}: NodeJS.ProcessEnv): RequiredCIVariables | undefined {
  if (GITHUB_ACTIONS) {
    const repository = GITHUB_REPOSITORY as string;
    const commitSHA = GITHUB_SHA as string;
    const [owner, repo] = repository.split('/');
    return { owner, repo, commitSHA };
  }
  return undefined;
}
