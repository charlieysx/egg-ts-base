// This file is created by egg-ts-helper@1.25.6
// Do not modify this file!!!!!!!!!

import 'egg';
import ExportLibOss from '../../../app/service/lib/Oss';
import ExportTestTest from '../../../app/service/test/test';

declare module 'egg' {
  interface IService {
    lib: {
      oss: ExportLibOss;
    }
    test: {
      test: ExportTestTest;
    }
  }
}
