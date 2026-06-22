/* eslint-disable unused-imports/no-unused-vars */

import type NoteEntity from '../entity/note.js';
import type { INoteRepository } from './noteRepository.js';

class MockNoteRepository implements INoteRepository {
  getMany(
    userId: string,
    filters?: {
      contains?: string;
      isActive?: boolean;
      isArchived?: boolean;
      isTrashed?: boolean;
    },
  ): Promise<NoteEntity[]> {
    throw new Error('Method not implemented.');
  }
  getById(userId: string, noteId: string): Promise<NoteEntity> {
    throw new Error('Method not implemented.');
  }
  insert({
    userId,
    title,
    jsonContent,
    textContent,
  }: Readonly<{
    userId: string;
    title: string;
    jsonContent: string;
    textContent: string;
  }>): Promise<NoteEntity> {
    throw new Error('Method not implemented.');
  }
  updateById({
    noteId,
    payload,
  }: Readonly<{
    noteId: string;
    payload: {
      title: string;
      jsonContent: string;
      textContent: string;
      updatedAt: Date | string;
      archivedAt: Date | string | null;
      trashedAt: Date | string | null;
    };
  }>): Promise<NoteEntity> {
    throw new Error('Method not implemented.');
  }
  deleteMany(userId: string): Promise<void> {
    throw new Error('Method not implemented.');
  }
  deleteById(userId: string, noteId: string): Promise<void> {
    throw new Error('Method not implemented.');
  }
}

export default MockNoteRepository;
