import NoteEntity from '@/domain/note/entity/note.js';
import { NoteDetailResponse, NoteSimpleResponse } from '../note.js';

export function noteSimpleConverter(
  noteEntity: NoteEntity,
): NoteSimpleResponse {
  const {
    archivedAt: _archivedAt,
    trashedAt: _trashedAt,
    ...restNoteFields
  } = noteEntity;

  return new NoteSimpleResponse(restNoteFields);
}

export function noteDetailConverter(
  noteEntity: NoteEntity,
): NoteDetailResponse {
  return new NoteDetailResponse(noteEntity);
}
