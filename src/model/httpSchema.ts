import Type, { type Static } from 'typebox';

export const WebResponseErrorTypeBox = Type.Object({
  title: Type.String(),
  status: Type.Number(),
  detail: Type.String(),
  errors: Type.Object({}, { additionalProperties: true }),
});

export type TWebResponseErrorTypeBox = Static<typeof WebResponseErrorTypeBox>;
