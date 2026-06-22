import ClientError from './clientError.js';

class BadRequestError<T> extends ClientError {
  title: string;
  errors: T;

  constructor({
    title,
    message = 'Bad request',
    errors,
  }: Readonly<{
    title: string;
    message?: string;
    errors: T;
  }>) {
    super(message, 400);

    this.title = title;
    this.errors = errors;
    this.name = 'BadRequestError';
  }
}

export default BadRequestError;
