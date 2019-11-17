export type FileConfig = {
  path: string;
  maxSize: string;
  compression?: string;
};

type AnalyzedFile = {
  fail: boolean;
  message: string;
};

export type AnalyzeResult = {
  files: AnalyzedFile[];
  totalSize: number;
  totalMaxSize: number;
  bundleFail: boolean;
  failureCount: number;
};
