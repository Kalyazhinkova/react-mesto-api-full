import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User } from '../models/user.js';
import { BadRequestError } from '../errors/BadRequestError.js';
import { ConflictError } from '../errors/ConflictError.js';
import { NotFoundError } from '../errors/NotFoundError.js';

const badRequestError = (message) => new BadRequestError(message);
const notUniqueErrorCode = 11000;

export const login = (req, res, next) => {
  User.findOneAndValidatePassword(req.body)
    .then((user) => {
      const { JWT_SALT } = req.app.get('config');
      const token = jwt.sign({ _id: user._id }, JWT_SALT, { expiresIn: '7d' });
      res.send({ token });
    })
    .catch((err) => {
      next(err);
    });
};

export const create = (req, res, next) => {
  bcrypt.hash(req.body.password, 10)
    .then((hash) => {
      req.body.password = hash;
      return User.create(req.body);
    })
    .then((document) => {
      const { password: removed, ...user } = document.toObject();
      res.send({ data: user });
    })
    .catch((err) => {
      if (err.code === notUniqueErrorCode) {
        next(new ConflictError('Пользователь с такой почтой уже существует!'));
      } else if (err.name === 'ValidationError') {
        next(badRequestError(err.message));
      } else {
        next(err);
      }
    });
};

export const readById = (req, res, next) => {
  const id = (req.params.id === 'me') ? req.user._id : req.params.id;
  User.findById(id)
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Пользователь не найден!');
      } else {
        res.send(user);
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(badRequestError(err.message));
      } else {
        next(err);
      }
    });
};

export const readAll = (req, res, next) => {
  User.find({})
    .then((users) => {
      res.send(users);
    })
    .catch((err) => {
      next(err);
    });
};

export const update = (req, res, next) => {
  const { name, about } = req.body;
  const userId = req.user._id;
  User.findByIdAndUpdate(userId, { name, about }, { new: true })
    .then((updateUser) => {
      if (updateUser) {
        res.send(updateUser);
      } else {
        throw new NotFoundError('Не удалось обновить пользователя');
      }
    })
    .catch((err) => {
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        next(badRequestError(err.message));
      } else {
        next(err);
      }
    });
};

export const updateAvatar = (req, res, next) => {
  const { avatar } = req.body;
  const userId = req.user._id;
  User.findByIdAndUpdate(userId, { avatar }, { new: true })
    .then((updateUser) => {
      if (updateUser) {
        res.send(updateUser);
      } else {
        throw new NotFoundError('Не удалось обновить аватар пользователя');
      }
    })
    .catch((err) => {
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        next(badRequestError(err.message));
      } else {
        next(err);
      }
    });
};
