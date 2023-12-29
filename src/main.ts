import express from 'express';
import mongoose from 'mongoose';
import rateLimit from 'express-rate-limit';
import methodOverride from 'method-override';
import * as bodyParser from 'body-parser';
import cors from 'cors';
import http from 'http';
import morgan from 'morgan';
import helmet from 'helmet';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import { apiV1 } from './api';
import { logger } from './util/logger/winston-init';
import env from './util/constants/env';
import errorHandlerMiddleware from './middleware/errorHandler.middleware';

const app = express();
const port = env.port;

mongoose
  .connect(env.mongoConnection)
  .then(() => {
    logger.info('Connected to MongoDB');
  })
  .catch((err) => {
    logger.error('Error connecting to MongoDB:', err);
    process.exit(1);
  });

app.use(methodOverride('_method'));

app.use(helmet());

app.use(morgan('combined'));

app.use(cookieParser());

app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
app.use(bodyParser.json());

app.use(
  cors({
    credentials: true,
    origin: [env.WEBSITE_URL],
    methods: ['GET', 'POST', 'DELETE', 'UPDATE', 'PUT', 'PATCH'],
  })
);

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 1000,
});
app.use(apiLimiter);

app.use(
  compression({
    level: 6,
    filter: (req, res) => {
      if (req.headers['x-no-compression']) {
        return false;
      }
      return compression.filter(req, res);
    },
  })
);

app.use(errorHandlerMiddleware);

const server = http.createServer(app);

apiV1(app);

server.listen(port, () => {
  logger.info(`Server running on port ${port}`);
});

export default logger;
