import { Type, type Static } from 'typebox';

import { WebResponseErrorTypeBox } from '@/model/httpSchema.js';
import {
  NoteDetailResponseTypeBox,
  NoteSimpleResponseTypeBox,
} from '@/model/note/noteSchema.js';

export const notesRoutesSchemas = {
  '/notes': {
    GET: {
      schema: {
        querystring: Type.Object({
          search: Type.Optional(Type.String()),
          is_active: Type.Optional(
            Type.Union([Type.Literal('true'), Type.Literal('false')]),
          ),
          is_archived: Type.Optional(
            Type.Union([Type.Literal('true'), Type.Literal('false')]),
          ),
          is_trashed: Type.Optional(
            Type.Union([Type.Literal('true'), Type.Literal('false')]),
          ),
        }),
        response: {
          200: Type.Object({
            data: Type.Object({
              notes: Type.Object({
                active: Type.Array(NoteSimpleResponseTypeBox),
                archived: Type.Array(NoteSimpleResponseTypeBox),
                trash: Type.Array(NoteSimpleResponseTypeBox),
              }),
            }),
          }),
          400: WebResponseErrorTypeBox,
          401: WebResponseErrorTypeBox,
          500: WebResponseErrorTypeBox,
        },
      },
    },
    POST: {
      schema: {
        body: Type.Object({
          title: Type.String({
            maxLength: 128,
          }),
          jsonContent: Type.String(),
        }),
        response: {
          201: Type.Object({
            data: Type.Object({
              note: NoteSimpleResponseTypeBox,
            }),
          }),
          400: WebResponseErrorTypeBox,
          401: WebResponseErrorTypeBox,
          500: WebResponseErrorTypeBox,
        },
      },
    },
    DELETE: {
      schema: {
        response: {
          204: Type.Unknown(),
          401: WebResponseErrorTypeBox,
          500: WebResponseErrorTypeBox,
        },
      },
    },
  },
  '/notes/:noteId': {
    GET: {
      schema: {
        params: Type.Object({
          noteId: Type.String({
            format: 'uuid',
          }),
        }),
        response: {
          200: Type.Object({
            data: Type.Object({
              note: NoteDetailResponseTypeBox,
            }),
          }),
          401: WebResponseErrorTypeBox,
          404: WebResponseErrorTypeBox,
          500: WebResponseErrorTypeBox,
        },
      },
    },
    PUT: {
      schema: {
        params: Type.Object({
          noteId: Type.String({
            format: 'uuid',
          }),
        }),
        body: Type.Object({
          title: Type.String({
            maxLength: 128,
          }),
          jsonContent: Type.String(),
          status: Type.Union([
            Type.Literal('active'),
            Type.Literal('archived'),
          ]),
          isTrashed: Type.Boolean(),
        }),
        response: {
          200: Type.Object({
            data: Type.Object({
              note: NoteSimpleResponseTypeBox,
            }),
          }),
          400: WebResponseErrorTypeBox,
          401: WebResponseErrorTypeBox,
          404: WebResponseErrorTypeBox,
          500: WebResponseErrorTypeBox,
        },
      },
    },
    PATCH: {
      schema: {
        params: Type.Object({
          noteId: Type.String({
            format: 'uuid',
          }),
        }),
        body: Type.Object(
          {
            title: Type.Optional(
              Type.String({
                maxLength: 128,
              }),
            ),
            jsonContent: Type.Optional(Type.String()),
            status: Type.Optional(
              Type.Union([Type.Literal('active'), Type.Literal('archived')]),
            ),
            isTrashed: Type.Optional(Type.Boolean()),
          },
          { additionalProperties: false, minProperties: 1 },
        ),
        response: {
          200: Type.Object({
            data: Type.Object({
              note: NoteSimpleResponseTypeBox,
            }),
          }),
          400: WebResponseErrorTypeBox,
          401: WebResponseErrorTypeBox,
          404: WebResponseErrorTypeBox,
          500: WebResponseErrorTypeBox,
        },
      },
    },
    DELETE: {
      schema: {
        params: Type.Object({
          noteId: Type.String({
            format: 'uuid',
          }),
        }),
        response: {
          204: Type.Unknown(),
          401: WebResponseErrorTypeBox,
          500: WebResponseErrorTypeBox,
        },
      },
    },
  },
};

export type TNoteRoutesSchemas = {
  '/notes': {
    GET: {
      Querystring: Static<
        (typeof notesRoutesSchemas)['/notes']['GET']['schema']['querystring']
      >;
      Reply: {
        200: Static<
          (typeof notesRoutesSchemas)['/notes']['GET']['schema']['response']['200']
        >;
        400: Static<
          (typeof notesRoutesSchemas)['/notes']['GET']['schema']['response']['400']
        >;
        401: Static<
          (typeof notesRoutesSchemas)['/notes']['GET']['schema']['response']['401']
        >;
        500: Static<
          (typeof notesRoutesSchemas)['/notes']['GET']['schema']['response']['500']
        >;
      };
    };
    POST: {
      Body: Static<
        (typeof notesRoutesSchemas)['/notes']['POST']['schema']['body']
      >;
      Reply: {
        201: Static<
          (typeof notesRoutesSchemas)['/notes']['POST']['schema']['response']['201']
        >;
        400: Static<
          (typeof notesRoutesSchemas)['/notes']['POST']['schema']['response']['400']
        >;
        401: Static<
          (typeof notesRoutesSchemas)['/notes']['POST']['schema']['response']['401']
        >;
        500: Static<
          (typeof notesRoutesSchemas)['/notes']['POST']['schema']['response']['500']
        >;
      };
    };
    DELETE: {
      Reply: {
        204: Static<
          (typeof notesRoutesSchemas)['/notes']['DELETE']['schema']['response']['204']
        >;
        401: Static<
          (typeof notesRoutesSchemas)['/notes']['DELETE']['schema']['response']['401']
        >;
        500: Static<
          (typeof notesRoutesSchemas)['/notes']['DELETE']['schema']['response']['500']
        >;
      };
    };
  };
  '/notes/:noteId': {
    GET: {
      Params: Static<
        (typeof notesRoutesSchemas)['/notes/:noteId']['GET']['schema']['params']
      >;
      Reply: {
        200: Static<
          (typeof notesRoutesSchemas)['/notes/:noteId']['GET']['schema']['response']['200']
        >;
        401: Static<
          (typeof notesRoutesSchemas)['/notes/:noteId']['GET']['schema']['response']['401']
        >;
        404: Static<
          (typeof notesRoutesSchemas)['/notes/:noteId']['GET']['schema']['response']['404']
        >;
        500: Static<
          (typeof notesRoutesSchemas)['/notes/:noteId']['GET']['schema']['response']['500']
        >;
      };
    };
    PUT: {
      Params: Static<
        (typeof notesRoutesSchemas)['/notes/:noteId']['PUT']['schema']['params']
      >;
      Body: Static<
        (typeof notesRoutesSchemas)['/notes/:noteId']['PUT']['schema']['body']
      >;
      Reply: {
        200: Static<
          (typeof notesRoutesSchemas)['/notes/:noteId']['PUT']['schema']['response']['200']
        >;
        400: Static<
          (typeof notesRoutesSchemas)['/notes/:noteId']['PUT']['schema']['response']['400']
        >;
        401: Static<
          (typeof notesRoutesSchemas)['/notes/:noteId']['PUT']['schema']['response']['401']
        >;
        404: Static<
          (typeof notesRoutesSchemas)['/notes/:noteId']['PUT']['schema']['response']['404']
        >;
        500: Static<
          (typeof notesRoutesSchemas)['/notes/:noteId']['PUT']['schema']['response']['500']
        >;
      };
    };
    PATCH: {
      Params: Static<
        (typeof notesRoutesSchemas)['/notes/:noteId']['PATCH']['schema']['params']
      >;
      Body: Static<
        (typeof notesRoutesSchemas)['/notes/:noteId']['PATCH']['schema']['body']
      >;
      Reply: {
        200: Static<
          (typeof notesRoutesSchemas)['/notes/:noteId']['PATCH']['schema']['response']['200']
        >;
        400: Static<
          (typeof notesRoutesSchemas)['/notes/:noteId']['PATCH']['schema']['response']['400']
        >;
        401: Static<
          (typeof notesRoutesSchemas)['/notes/:noteId']['PATCH']['schema']['response']['401']
        >;
        404: Static<
          (typeof notesRoutesSchemas)['/notes/:noteId']['PATCH']['schema']['response']['404']
        >;
        500: Static<
          (typeof notesRoutesSchemas)['/notes/:noteId']['PATCH']['schema']['response']['500']
        >;
      };
    };
    DELETE: {
      Params: Static<
        (typeof notesRoutesSchemas)['/notes/:noteId']['DELETE']['schema']['params']
      >;
      Reply: {
        204: Static<
          (typeof notesRoutesSchemas)['/notes/:noteId']['DELETE']['schema']['response']['204']
        >;
        401: Static<
          (typeof notesRoutesSchemas)['/notes/:noteId']['DELETE']['schema']['response']['401']
        >;
        500: Static<
          (typeof notesRoutesSchemas)['/notes/:noteId']['DELETE']['schema']['response']['500']
        >;
      };
    };
  };
};
