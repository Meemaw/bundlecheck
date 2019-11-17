import { RequiredCIVariables, CIProvider } from '../types';

const travisProvider: CIProvider = {
  detect: ({ TRAVIS }: NodeJS.ProcessEnv) => {
    return Boolean(TRAVIS);
  },

  configuration: ({
    TRAVIS_REPO_SLUG,
    TRAVIS_PULL_REQUEST_SLUG,
    TRAVIS_PULL_REQUEST_SHA,
    TRAVIS_COMMIT,
  }: NodeJS.ProcessEnv): RequiredCIVariables => {
    const repoSlug = (TRAVIS_REPO_SLUG || TRAVIS_PULL_REQUEST_SLUG) as string;
    const commitSHA = (TRAVIS_PULL_REQUEST_SHA || TRAVIS_COMMIT) as string;
    const [owner, repo] = repoSlug.split('/');
    return { owner, repo, commitSHA };
  },
};

export default travisProvider;
