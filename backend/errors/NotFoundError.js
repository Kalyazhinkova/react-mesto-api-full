import { constants } from 'http2';
import { HTTPError } from './HTTPError.js';

export class NotFoundError extends HTTPError {
  constructor(message) {
    super(message, constants.HTTP_STATUS_NOT_FOUND);
  }
}
