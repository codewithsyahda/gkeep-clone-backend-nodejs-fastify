import type { IDocumentSchema } from '@/application/utility/documentSchema.js';
import jsonDocStrToText from '@/common/helper/jsonDocStrToText.js';

class DocumentSchemaImpl implements IDocumentSchema {
  jsonDocStrToText(jsonStrDoc: string): string {
    return jsonDocStrToText(jsonStrDoc);
  }
}

export default DocumentSchemaImpl;
