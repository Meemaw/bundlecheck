import { RequiredCIVariables, CIProvider } from '../types';

const githubProvder: CIProvider = {
  detect: ({ GITHUB_ACTIONS }: NodeJS.ProcessEnv) => {
    return Boolean(GITHUB_ACTIONS);
  },

  configuration: ({ GITHUB_REPOSITORY, GITHUB_SHA }: NodeJS.ProcessEnv): RequiredCIVariables => {
    const repository = GITHUB_REPOSITORY as string;
    const commitSHA = GITHUB_SHA as string;
    const [owner, repo] = repository.split('/');
    return { owner, repo, commitSHA };
  },
};

export default githubProvder;
