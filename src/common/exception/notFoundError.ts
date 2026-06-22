import ClientError from './clientError.js';

class NotFoundError extends ClientError {
  title: string;
  constructor(title: string, message: string = 'Not found') {
    super(message, 404);

    this.title = title;
    this.name = 'NotFoundError';
  }
}

export default NotFoundError;
