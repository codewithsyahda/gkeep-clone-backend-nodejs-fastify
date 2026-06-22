/* eslint-disable unused-imports/no-unused-vars */

import type { IDocumentSchema } from './documentSchema.js';

class MockDocumentSchema implements IDocumentSchema {
  jsonDocStrToText(jsonStrDoc: string): string {
    throw new Error('Method not implemented.');
  }
}

export default MockDocumentSchema;
