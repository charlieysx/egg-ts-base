// This file is created by egg-ts-helper@1.25.6
// Do not modify this file!!!!!!!!!

import 'egg';
import ExportResponse from '../../../app/middleware/response';

declare module 'egg' {
  interface IMiddleware {
    response: typeof ExportResponse;
  }
}
