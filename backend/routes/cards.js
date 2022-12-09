import { Router } from 'express';
import {
  read, create, remove, likeCard, dislikeCard,
} from '../controllers/cards.js';
import { celebrateBodyCard, celebrateParamsRouteId } from '../validators/card.js';

export const router = Router();

router.get('/', read);
router.post('/', celebrateBodyCard, create);
router.delete('/:id', celebrateParamsRouteId, remove);
router.put('/:id/likes', celebrateParamsRouteId, likeCard);
router.delete('/:id/likes', celebrateParamsRouteId, dislikeCard);
