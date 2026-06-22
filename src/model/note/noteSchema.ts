import { Type, type Static } from 'typebox';

export const NoteSimpleResponseTypeBox = Type.Object({
  id: Type.String({
    format: 'uuid',
  }),
  title: Type.String({
    maxLength: 128,
  }),
  jsonContent: Type.String(),
  createdAt: Type.String({
    format: 'date-time',
  }),
  updatedAt: Type.String({
    format: 'date-time',
  }),
  authorId: Type.String(),
});

export type TNoteSimpleResponseTypeBox = Static<
  typeof NoteSimpleResponseTypeBox
>;

export const NoteDetailResponseTypeBox = Type.Object({
  id: Type.String({
    format: 'uuid',
  }),
  title: Type.String({
    maxLength: 128,
  }),
  jsonContent: Type.String(),
  createdAt: Type.String({
    format: 'date-time',
  }),
  updatedAt: Type.String({
    format: 'date-time',
  }),
  archivedAt: Type.Union([
    Type.String({
      format: 'date-time',
    }),
    Type.Null(),
  ]),
  trashedAt: Type.Union([
    Type.String({
      format: 'date-time',
    }),
    Type.Null(),
  ]),
  authorId: Type.String(),
});

export type TNoteDetailResponseTypeBox = Static<
  typeof NoteDetailResponseTypeBox
>;
