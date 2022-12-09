import { celebrator, Joi } from 'celebrate';

// Настраиваем celebrate для дальнейшего использования
export const celebrate = celebrator(
  { mode: 'full' }, // проверять весь запрос, а не только его часть - это указание для celebrate
  { abortEarly: false }, // не останавливать проверку при первой же ошибке - это указание для Joi
);

export const sсhemaObjectId = Joi.string().hex().length(24); // как валидировать ObjectID
// eslint-disable-next-line no-useless-escape
export const sсhemaURL = Joi.string().pattern(/^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/); // проверка на url
