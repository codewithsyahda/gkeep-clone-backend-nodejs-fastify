/* eslint-disable unused-imports/no-unused-vars */

import type {
  CreateNoteRequest,
  NoteDetailResponse,
  NoteSimpleResponse,
  UpdateNoteRequest,
} from '@/model/note/note.js';
import type { INoteUseCase } from './noteUseCase.js';

export class MockNoteUseCase implements INoteUseCase {
  getAll(
    userId: string,
    filters: {
      search?: string;
      isActive?: 'true' | 'false';
      isArchived?: 'true' | 'false';
      isTrashed?: 'true' | 'false';
    },
  ): Promise<{
    notes: {
      active: NoteSimpleResponse[];
      archived: NoteSimpleResponse[];
      trash: NoteSimpleResponse[];
    };
  }> {
    throw new Error('Method not implemented.');
  }
  getById(
    userId: string,
    noteId: string,
  ): Promise<{ note: NoteDetailResponse }> {
    throw new Error('Method not implemented.');
  }
  create(
    userId: string,
    payload: CreateNoteRequest,
  ): Promise<{ note: NoteSimpleResponse }> {
    throw new Error('Method not implemented.');
  }
  updateById(
    userId: string,
    noteId: string,
    payload: UpdateNoteRequest,
  ): Promise<{ note: NoteSimpleResponse }> {
    throw new Error('Method not implemented.');
  }
  patchById(
    userId: string,
    noteId: string,
    payload: Partial<UpdateNoteRequest>,
  ): Promise<{ note: NoteSimpleResponse }> {
    throw new Error('Method not implemented.');
  }
  deleteAll(userId: string): Promise<void> {
    throw new Error('Method not implemented.');
  }
  deleteById(userId: string, noteId: string): Promise<void> {
    throw new Error('Method not implemented.');
  }
}

export default MockNoteUseCase;
