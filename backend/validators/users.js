import { Joi, Segments } from 'celebrate';
import { celebrate, sсhemaObjectId, sсhemaURL } from './common.js';

const schemaRouterMe = Joi.alternatives().try(
  Joi.string().equal('me'),
  sсhemaObjectId,
).required();

export const schemaAvatar = sсhemaURL;
export const schemaEmail = Joi.string().email().required();
const schemaPassword = Joi.string().required();
const schemaName = Joi.string().min(2).max(30);
const schemaAbout = Joi.string().min(2).max(30);

const schemaObjectRouteMe = Joi.object({ id: schemaRouterMe }).required();
const schemaObjectProfile = Joi.object({ name: schemaName, about: schemaAbout });
const schemaObjectAvatar = Joi.object({ avatar: schemaAvatar }).required();
const schemaObjectUserAuth = Joi.object({ email: schemaEmail, password: schemaPassword });
const schemaObjectUser = schemaObjectUserAuth
  .concat(schemaObjectProfile).concat(schemaObjectAvatar);

const segmentBodyProfile = { [Segments.BODY]: schemaObjectProfile };
const segmentBodyAvatar = { [Segments.BODY]: schemaObjectAvatar };
const segmentBodyUserAuth = { [Segments.BODY]: schemaObjectUserAuth };
const segmentBodyUser = { [Segments.BODY]: schemaObjectUser };
const segmentParamsRouteMe = { [Segments.PARAMS]: schemaObjectRouteMe };

export const celebrateBodyAvatar = celebrate(segmentBodyAvatar);
export const celebrateBodyProfile = celebrate(segmentBodyProfile);
export const celebrateBodyAuth = celebrate(segmentBodyUserAuth);
export const celebrateBodyUser = celebrate(segmentBodyUser);
export const celebrateParamsRouteMe = celebrate(segmentParamsRouteMe);
