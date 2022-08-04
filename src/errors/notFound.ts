import { StatusCodes } from 'http-status-codes';
import CustomApiError from './error';

class NotFoundError extends CustomApiError {
  constructor(message: string) {
    super(message);
    this.status = StatusCodes.NOT_FOUND;
  }
}

export default NotFoundError;
