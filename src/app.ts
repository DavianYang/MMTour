process.env['NODE_CONFIG_DIR'] = __dirname + '/configs';

import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import ExpressMongoSanitize from 'express-mongo-sanitize';
import xss from 'xss-clean';
import hpp from 'hpp';
import cookieParser from 'cookie-parser';
import compression from 'compression';
import mongoose from 'mongoose';
import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

import Routes from '@interfaces/routes.interface';
import { dbConnection } from '@databases/mongodb';
import { errorConverter, errorHandler } from '@middlwares/error.middleware';
import AppError from '@exceptions/AppError';
import { logger, stream } from '@utils/logger';
import * as strings from '@resources/strings';

class App {
  public app: express.Application;
  public port: string | number;
  public env: string;

  constructor(routes: Routes[]) {
    this.app = express();
    this.port = process.env.PORT || 3000;
    this.env = process.env.NODE_ENV || 'development';

    this.connectToDatabase();
    this.initializeMiddlewares();
    this.initializeRoutes(routes);
    this.initializeSwagger();
    this.initializeErrorHandling();
  }

  public listen() {
    return this.app.listen(this.port, () => {
      logger.info(`=================================`);
      logger.info(`======= ENV: ${this.env} =======`);
      logger.info(`🚀 App listening on the port http://127.0.0.1:${this.port}/`);
      logger.info(`📗 For API Documentation http://127.0.0.1:${this.port}/api-docs`);
      logger.info(`=================================`);
    });
  }

  public getServer() {
    return this.app;
  }

  private connectToDatabase() {
    if (this.env !== 'production') {
      mongoose.set('debug', true);
    }
    mongoose.connect(dbConnection.url, dbConnection.options);
  }

  public initializeMiddlewares() {
    const limiter = rateLimit({
      max: 100, // limit each ip to 100 request per windowMS
      windowMs: 60 * 60 * 1000,
      message: strings.REQUEST_OVERLOAD_TRY_AGAIN_IN_AN_HOUR,
    });

    if (this.env === 'production') {
      this.app.enable('trust proxy');
      this.app.use(morgan('combined', { stream }));
      this.app.use(cors({ origin: 'https://www.mmtour.com', credentials: true }));
      this.app.use('/api', limiter);
    } else {
      this.app.use(morgan('dev', { stream }));
      this.app.use(cors({ origin: true, credentials: true }));
    }

    // Set security for HTTP headers
    this.app.use(helmet());

    // Body, parser, reading data from req.body
    this.app.use(express.json({ limit: '10kb' }));
    this.app.use(express.urlencoded({ extended: true, limit: '10kb' }));
    this.app.use(cookieParser());

    // Data sanitization against NoSQL query injection
    this.app.use(ExpressMongoSanitize());

    // Data sanitization against XSS
    this.app.use(xss());

    // Prevent parameter pollution
    this.app.use(
      hpp({
        whitelist: ['duration', 'ratingsQuantity', 'ratingsAverage', 'maxGroupSize', 'difficulty', 'price'],
      }),
    );

    // Compress send API
    this.app.use(compression());
  }

  private initializeRoutes(routes: Routes[]) {
    routes.forEach(route => {
      this.app.use('/api/v1/', route.router);
    });
  }

  private initializeSwagger() {
    const options = {
      swaggerDefinition: {
        info: {
          title: 'MMTour REST API',
          version: '1.0.0',
          description: 'Example doc',
        },
      },
      apis: ['swagger.yaml'],
    };

    const specs = swaggerJSDoc(options);
    this.app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));
  }
  private initializeErrorHandling() {
    this.app.all('*', (req, res, next) => {
      next(new AppError(`Can't find ${req.originalUrl} on this server`, 404));
    });
    this.app.use(errorConverter);
    this.app.use(errorHandler);
  }
}

export default App;
