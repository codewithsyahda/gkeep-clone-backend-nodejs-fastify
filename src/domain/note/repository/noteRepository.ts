import type NoteEntity from '../entity/note.js';

export interface INoteRepository {
  getMany(
    userId: string,
    filters?: {
      contains?: string;
      isActive?: boolean;
      isArchived?: boolean;
      isTrashed?: boolean;
    },
  ): Promise<NoteEntity[]>;
  getById(userId: string, noteId: string): Promise<NoteEntity>;
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
  }>): Promise<NoteEntity>;
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
  }>): Promise<NoteEntity>;
  deleteMany(userId: string): Promise<void>;
  deleteById(userId: string, noteId: string): Promise<void>;
}
