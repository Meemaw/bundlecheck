import { RequiredCIVariables, CIProvider } from '../types';

const circleciProvider: CIProvider = {
  detect: ({ CIRCLECI }: NodeJS.ProcessEnv) => {
    return Boolean(CIRCLECI);
  },

  configuration: ({
    CIRCLE_PROJECT_USERNAME,
    CIRCLE_PROJECT_REPONAME,
    CIRCLE_SHA1,
  }: NodeJS.ProcessEnv): RequiredCIVariables => {
    const repo = CIRCLE_PROJECT_REPONAME as string;
    const owner = CIRCLE_PROJECT_USERNAME as string;
    const commitSHA = CIRCLE_SHA1 as string;
    return { owner, repo, commitSHA };
  },
};

export default circleciProvider;
