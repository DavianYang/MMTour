process.env['NODE_CONFIG_DIR'] = __dirname + '/configs';

import App from '@/app';
import { IndexRoute } from './routes/index.route';
import { UserRoute } from '@routes/users.route';
import { TourRoute } from '@routes/tours.route';

const app = new App([new IndexRoute(), new UserRoute(), new TourRoute()]);

app.listen();
