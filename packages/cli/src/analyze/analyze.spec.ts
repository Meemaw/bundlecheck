import sinon from 'sinon';
import logger from '../logger';

import { analyzeFiles } from './analyze';
import { sandbox } from '../test/utils';

describe('analyze', () => {
  it('should not fail bundle on empty array', () => {
    expect(analyzeFiles([])).toEqual({
      failureCount: 0,
      totalSize: 0,
      totalMaxSize: 0,
      bundleFail: false,
      files: [],
    });
  });

  it('should fail bundle on single fail file', () => {
    const loggerErrorSpy = sandbox.spy(logger, 'error');
    const toProcess = [{ path: './index.ts', maxSize: 10, size: 15, compression: 'none' }];

    expect(analyzeFiles(toProcess)).toEqual({
      failureCount: 1,
      totalSize: 15,
      totalMaxSize: 10,
      bundleFail: true,
      files: [{ fail: true, message: './index.ts: 15B > maxSize 10B (no compression)' }],
    });

    sandbox.assert.alwaysCalledWithExactly(
      loggerErrorSpy,
      './index.ts: 15B > maxSize 10B (no compression)'
    );
  });

  it('should fail when some failed files', async () => {
    const loggerErrorSpy = sandbox.spy(logger, 'error');
    const loggerPassSpy = sandbox.spy(logger, 'pass');

    const toProcess = [
      { path: './index.ts', maxSize: 10, size: 15, compression: 'none' },
      { path: './test/index.ts', maxSize: 17, size: 15, compression: 'gzip' },
    ];

    expect(analyzeFiles(toProcess)).toEqual({
      failureCount: 1,
      totalSize: 30,
      totalMaxSize: 27,
      bundleFail: true,
      files: [
        { fail: true, message: './index.ts: 15B > maxSize 10B (no compression)' },
        { fail: false, message: './test/index.ts: 15B < maxSize 17B (gzip)' },
      ],
    });

    sandbox.assert.calledWithExactly(
      loggerErrorSpy,
      './index.ts: 15B > maxSize 10B (no compression)'
    );
    sandbox.assert.calledWithExactly(loggerPassSpy, './test/index.ts: 15B < maxSize 17B (gzip)');
  });

  it('should pass when all files are passing', () => {
    const loggerPassSpy = sandbox.spy(logger, 'pass');

    const toProcess = [
      { path: './index.ts', maxSize: 20, size: 15, compression: 'none' },
      { path: './test/index.ts', maxSize: 20, size: 15, compression: 'gzip' },
    ];

    expect(analyzeFiles(toProcess)).toEqual({
      failureCount: 0,
      totalSize: 30,
      totalMaxSize: 40,
      bundleFail: false,
      files: [
        { fail: false, message: './index.ts: 15B < maxSize 20B (no compression)' },
        { fail: false, message: './test/index.ts: 15B < maxSize 20B (gzip)' },
      ],
    });

    sandbox.assert.calledTwice(loggerPassSpy);
  });
});
