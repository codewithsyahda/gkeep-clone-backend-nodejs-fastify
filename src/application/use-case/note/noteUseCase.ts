import type {
  CreateNoteRequest,
  NoteDetailResponse,
  NoteSimpleResponse,
  UpdateNoteRequest,
} from '@/model/note/note.js';

export interface INoteUseCase {
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
  }>;
  getById(
    userId: string,
    noteId: string,
  ): Promise<{ note: NoteDetailResponse }>;
  create(
    userId: string,
    payload: CreateNoteRequest,
  ): Promise<{ note: NoteSimpleResponse }>;
  updateById(
    userId: string,
    noteId: string,
    payload: UpdateNoteRequest,
  ): Promise<{ note: NoteSimpleResponse }>;
  patchById(
    userId: string,
    noteId: string,
    payload: Partial<UpdateNoteRequest>,
  ): Promise<{ note: NoteSimpleResponse }>;
  deleteAll(userId: string): Promise<void>;
  deleteById(userId: string, noteId: string): Promise<void>;
}
