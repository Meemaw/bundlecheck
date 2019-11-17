export type RequiredCIVariables = {
  owner: string;
  repo: string;
  commitSHA: string;
};

export type CIProvider = (env: NodeJS.ProcessEnv) => RequiredCIVariables | undefined;
