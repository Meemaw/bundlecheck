export type RequiredCIVariables = {
  owner: string;
  repo: string;
  commitSHA: string;
};

export type CIProvider = {
  detect: (env: NodeJS.ProcessEnv) => boolean;
  configuration: (env: NodeJS.ProcessEnv) => RequiredCIVariables;
};
