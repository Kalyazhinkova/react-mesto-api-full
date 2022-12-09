import { constants } from 'http2';
import { HTTPError } from './HTTPError.js';

export class ServerError extends HTTPError {
  constructor(message) {
    super(`Неизвестная ошибка. ${message}`, constants.HTTP_STATUS_SERVICE_UNAVAILABLE);
  }
}
