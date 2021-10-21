process.env['NODE_CONFIG_DIR'] = __dirname + '/configs';

import App from '@/app';
import { IndexRoute } from '@routes/index.route';
import { UserRoute } from '@routes/users.route';
import { TourRoute } from '@routes/tours.route';
import { ReviewRoute } from '@routes/reviews.route';
import { BookingRoute } from '@routes/bookings.route';

import { logger } from '@utils/logger';

process.on('uncaughtException', (err: Error) => {
  logger.error('UNCAUGHT EXCEPTION!! Shutting down...');
  logger.error(`${err.name}: ${err.message}`);

  process.exit(1);
});

const app = new App([new IndexRoute(), new TourRoute(), new UserRoute(), new ReviewRoute(), new BookingRoute()]);

const server = app.listen();

process.on('unhandledRejection', (err: Error) => {
  logger.error('UNHANDLED REJECTION!! Shutting down...');
  logger.error(`${err.name}: ${err.message}`);

  server.close(() => {
    process.exit(1);
  });
});

process.on('SIGTERM', () => {
  logger.info('SIGTERM RECEIVED. Shutting down....');
  server.close(() => {
    logger.info('Process terminated!');
  });
});
