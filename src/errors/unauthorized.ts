import { StatusCodes } from 'http-status-codes';
import CustomApiError from './error';

class UnauthorizedError extends CustomApiError {
  constructor(message: string) {
    super(message);
    this.status = StatusCodes.UNAUTHORIZED;
  }
}

export default UnauthorizedError;
