import toDateISOString from '@/common/helper/toDateISOString.js';

class NoteEntity {
  id: string;
  title: string;
  jsonContent: string;
  createdAt: Date | string;
  updatedAt: Date | string;
  archivedAt: Date | string | null;
  trashedAt: Date | string | null;
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

export default NoteEntity;
