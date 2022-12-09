import { Card } from '../models/card.js';
import { BadRequestError } from '../errors/BadRequestError.js';
import { ForbiddenError } from '../errors/ForbiddenError.js';
import { NotFoundError } from '../errors/NotFoundError.js';

const badRequestError = (message) => new BadRequestError(`Некорректные данные для карточки. ${message}`);

export const read = (req, res, next) => {
  Card.find({})
    .then((cards) => {
      res.send(cards);
    })
    .catch((err) => {
      next(err);
    });
};

export const create = (req, res, next) => {
  const { name, link } = req.body;
  const owner = req.user._id;
  Card.create({ name, link, owner })
    .then((newCard) => {
      res.send({ data: newCard });
    })
    .catch((err) => {
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        next(badRequestError(err.message));
      } else {
        next(err);
      }
    });
};

export const remove = (req, res, next) => {
  Card.findById(req.params.id)
    .then((card) => {
      if (!card) {
        throw new NotFoundError('Запрашиваемая карточка не найдена!');
      }
      if (card.owner.toString() !== req.user._id) {
        throw new ForbiddenError('Можно удалять только свои карточки!');
      }
      return Card.findByIdAndRemove(req.params.id);
    }).then((card) => { res.send(card); })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(badRequestError(err.message));
      } else {
        next(err);
      }
    });
};

export const likeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.id,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .then((result) => {
      if (!result) {
        throw new NotFoundError('Карточки с таким id не существует');
      } else { res.send(result); }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(badRequestError(err.message));
      } else {
        next(err);
      }
    });
};

export const dislikeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.id,
    { $pull: { likes: req.user._id } },
    { new: true },
  ).then((result) => {
    if (!result) {
      throw new NotFoundError('Карточки с таким id не существует');
    } else { res.send(result); }
  })
    .catch((err) => {
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        next(badRequestError(err.message));
      } else {
        next(err);
      }
    });
};
