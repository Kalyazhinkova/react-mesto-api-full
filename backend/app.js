import path from 'path';
import mongoose from 'mongoose';
import express from 'express';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import { constants } from 'http2';
import { errors } from 'celebrate';
import cors from 'cors';

import { router as userRouter } from './routes/users.js';
import { router as cardRouter } from './routes/cards.js';
import { router as authRouter } from './routes/auth.js';
import { auth } from './middlewares/auth.js';
import { requestLogger, errorLogger } from './middlewares/logger.js';
import { NotFoundError } from './errors/NotFoundError.js';

export const run = async (envName) => {
  try {
    process.on('unhandleRejection', (err) => {
      console.error(err);
      process.exit(1); // выход с ошибкой
    });

    const isProduction = envName.includes('prod');

    const config = dotenv.config({
      path: path.resolve(isProduction ? '.env' : '.env.common'),
    }).parsed;
    if (!config) {
      throw new Error('Config not found');
    }

    config.NODE_ENV = envName;
    config.IS_PROD = isProduction;

    const app = express();

    // Массив доменов, с которых разрешены кросс-доменные запросы
    const allowedCors = [
      'https://kalyazhinkova.mestoback.nomoredomains.club',
      'http://kalyazhinkova.mestoback.nomoredomains.club',
      'localhost:3000'];

    app.use(cors({
      origin: allowedCors,
      allowedHeaders: ['Content-Type', 'Authorization'],
    }));

    // для локального запуска
    // app.use(cors({
    //   origin: '*', allowedHeaders: ['Content-Type', 'Authorization'],
    // }));

    app.set('config', config);
    app.use(bodyParser.json());
    app.use(requestLogger);

    app.get('/crash-test', () => {
      setTimeout(() => {
        throw new Error('Сервер сейчас упадёт');
      }, 0);
    });

    app.use('/', authRouter);
    app.use('/users', auth, userRouter);
    app.use('/cards', auth, cardRouter);
    app.all('/*', () => { throw new NotFoundError('Запрашиваемая страница не найдена'); });
    app.use(errorLogger);
    app.use(errors());

    app.use((err, req, res, next) => {
      const status = err.statusCode || constants.HTTP_STATUS_INTERNAL_SERVER_ERROR;
      const message = err.message || 'Неизвестная ошибка';
      res.status(status).send({ message });
      next();
    });

    mongoose.set('runValidators', true);
    await mongoose.connect(config.DB_URL);
    const server = app.listen(config.PORT, config.HOST, () => {
      console.log(`Сервер запущен http://${config.HOST}:${config.PORT}`);
    });

    // завершаем работу приложения
    const stop = async () => {
      await mongoose.connection.close();
      server.close();
      process.exit(0); // выход без ошибок
    };

    process.on('SIGTERM', stop);
    process.on('SIGINT', stop);
  } catch (err) {
    console.error(`Сервер не запущен:${err.message}`);
  }
};
