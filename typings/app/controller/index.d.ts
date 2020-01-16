// This file is created by egg-ts-helper@1.25.6
// Do not modify this file!!!!!!!!!

import 'egg';
import ExportIndex from '../../../app/controller/index';
import ExportExampleIndex from '../../../app/controller/example/index';
import ExportExampleTest from '../../../app/controller/example/test';

declare module 'egg' {
  interface IController {
    index: ExportIndex;
    example: {
      index: ExportExampleIndex;
      test: ExportExampleTest;
    }
  }
}
