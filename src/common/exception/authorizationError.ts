import ClientError from './clientError.js';

class AuthorizationError extends ClientError {
  constructor(message: string = 'Unauthorized') {
    super(message, 401);

    this.name = 'AuthorizationError';
  }
}

export default AuthorizationError;
