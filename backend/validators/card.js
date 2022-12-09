import { Joi, Segments } from 'celebrate';
import { celebrate, sсhemaObjectId, sсhemaURL } from './common.js';

export const schemaLink = sсhemaURL.required();
export const schemaName = Joi.string().min(2).max(30).required();
export const schemaRouterId = sсhemaObjectId;

export const schemaObjectCard = Joi.object({ name: schemaName, link: schemaLink });
export const schemaObjectRouterId = Joi.object({ id: schemaRouterId }).required();

export const segmentBodyCard = { [Segments.BODY]: schemaObjectCard };
export const segmentParamsRouteMe = { [Segments.PARAMS]: schemaObjectRouterId };

export const celebrateBodyCard = celebrate(segmentBodyCard);
export const celebrateParamsRouteId = celebrate(segmentParamsRouteMe);
