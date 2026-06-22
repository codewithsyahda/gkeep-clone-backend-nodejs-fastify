import toDateISOString from '@/common/helper/toDateISOString.js';

export class NoteSimpleResponse {
  id: string;
  title: string;
  jsonContent: string;
  createdAt: string;
  updatedAt: string;
  authorId: string;

  constructor({
    id,
    title,
    jsonContent,
    createdAt,
    updatedAt,
    authorId,
  }: Readonly<{
    id: string;
    title: string;
    jsonContent: string;
    createdAt: Date | string;
    updatedAt: Date | string;
    authorId: string;
  }>) {
    this.id = id;
    this.title = title;
    this.jsonContent = jsonContent;
    this.createdAt = toDateISOString(createdAt);
    this.updatedAt = toDateISOString(updatedAt);
    this.authorId = authorId;
  }
}

export class NoteDetailResponse {
  id: string;
  title: string;
  jsonContent: string;
  createdAt: string;
  updatedAt: string;
  archivedAt: string | null;
  trashedAt: string | null;
  authorId: string;

  constructor({
    id,
    title,
    jsonContent,
    createdAt,
    updatedAt,
    archivedAt,
    trashedAt,
    authorId,
  }: Readonly<{
    id: string;
    title: string;
    jsonContent: string;
    createdAt: Date | string;
    updatedAt: Date | string;
    archivedAt: Date | string | null;
    trashedAt: Date | string | null;
    authorId: string;
  }>) {
    this.id = id;
    this.title = title;
    this.jsonContent = jsonContent;
    this.createdAt = toDateISOString(createdAt);
    this.updatedAt = toDateISOString(updatedAt);
    this.archivedAt = archivedAt === null ? null : toDateISOString(archivedAt);
    this.trashedAt = trashedAt === null ? null : toDateISOString(trashedAt);
    this.authorId = authorId;
  }
}

export class CreateNoteRequest {
  title: string;
  jsonContent: string;

  constructor(title: string, jsonContent: string) {
    this.title = title;
    this.jsonContent = jsonContent;
  }
}

export type TNoteStatus = 'active' | 'archived';

export class UpdateNoteRequest {
  title: string;
  jsonContent: string;
  status: TNoteStatus;
  isTrashed: boolean;

  constructor({ title, jsonContent, status, isTrashed }: UpdateNoteRequest) {
    this.title = title;
    this.jsonContent = jsonContent;
    this.status = status;
    this.isTrashed = isTrashed;
  }
}
