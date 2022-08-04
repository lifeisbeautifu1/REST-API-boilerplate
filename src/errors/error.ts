import { StatusCodes } from 'http-status-codes';

class CustomApiError extends Error {
  status: number;
  constructor(message: string) {
    super(message);
    this.status = StatusCodes.INTERNAL_SERVER_ERROR;
  }
}

export default CustomApiError;
