import { generateText } from '@tiptap/core';

import tiptapConfig from '../config/tiptap.js';

export default function jsonDocStrToText(jsonDocStr: string) {
  return generateText(JSON.parse(jsonDocStr), tiptapConfig.extensions)
    .trim()
    .replaceAll(/\s+/g, ' ');
}
