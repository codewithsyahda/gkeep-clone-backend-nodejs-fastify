import {
  type FastifyError,
  type FastifyPluginAsync,
  type FastifySchemaValidationError,
} from 'fastify';
import fastifyPlugin from 'fastify-plugin';

import AuthorizationError from '@/common/exception/authorizationError.js';
import BadRequestError from '@/common/exception/badRequestError.js';
import NotFoundError from '@/common/exception/notFoundError.js';
import capFirstWordInSentence from '@/common/helper/capFirstWordInSentence.js';
import { WebResponseError } from '@/model/http.js';

function validationErrorsFmt(
  context: 'query' | 'body',
  validationErrors: FastifySchemaValidationError[],
) {
  let instance: string;

  if (context === 'query') {
    instance = 'query';
  } else {
    instance = 'field';
  }

  return validationErrors
    .filter((vE) => vE.keyword !== 'anyOf')
    .map((vE) => {
      const errMessage = `${capFirstWordInSentence(vE.message || '')}.`;

      if (vE.keyword === 'required') {
        return {
          [instance]: vE.params.missingProperty,
          message: errMessage,
        };
      }

      if (vE.keyword === 'const') {
        return {
          [instance]: vE.instancePath.slice(1),
          message: `Must be equal to "${vE.params.allowedValue}" allowed value.`,
        };
      }

      return {
        [instance]: vE.instancePath.slice(1),
        message: errMessage,
      };
    });
}

const errorHandler: FastifyPluginAsync = async (fastify) => {
  fastify.setErrorHandler(async function (error, request, reply) {
    fastify.log.error({
      err: error,
      reqId: request.id,
    });

    if (error instanceof BadRequestError) {
      return reply.status(400).send(
        new WebResponseError({
          title: error.title,
          status: 400,
          detail: error.message,
          errors: {
            validation: error.errors,
          },
        }),
      );
    }

    if (error instanceof AuthorizationError) {
      return reply.status(401).send(
        new WebResponseError({
          title: 'Unauthorized',
          status: 401,
          detail: 'Authentication is required.',
          errors: {},
        }),
      );
    }

    if (error instanceof NotFoundError) {
      return reply.status(404).send(
        new WebResponseError({
          title: error.title,
          status: 404,
          detail: error.message,
          errors: {},
        }),
      );
    }

    const fstError = error as FastifyError;

    if (fstError.validationContext === 'querystring' && fstError.validation) {
      return reply.status(400).send(
        new WebResponseError({
          title: 'Query Parameters Validation Error',
          status: 400,
          detail: 'One or more query parameters are invalid.',
          errors: {
            validation: validationErrorsFmt('query', fstError.validation),
          },
        }),
      );
    }

    if (fstError.validationContext === 'body' && fstError.validation) {
      return reply.status(400).send(
        new WebResponseError({
          title: 'Body Request Validation Error',
          status: 400,
          detail: 'One or more body request fields are invalid.',
          errors: {
            validation: validationErrorsFmt('body', fstError.validation),
          },
        }),
      );
    }

    return reply.status(500).send(
      new WebResponseError({
        title: 'Internal Server Error',
        status: 500,
        detail: 'Cannot process the client request.',
        errors: {},
      }),
    );
  });
};

export default fastifyPlugin(errorHandler);
