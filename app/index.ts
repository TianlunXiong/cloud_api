import App from '@vikit/xnestjs';
import KoaBody from './middleware/koa-body';
import cors from './middleware/cors';
import './controller';

const config = require('config');
const port = config.get('port');

const app = new App();

app.use(KoaBody());
app.use(cors);
app.routes();
app.listen(port, () => {
  app.cycleLog();
  console.log(`the server run at ${port}`);
});