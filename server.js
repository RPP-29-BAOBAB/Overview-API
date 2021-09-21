const app = require('./app');
const config = require('./config');


app.listen(config.app.port, () => {
  console.log('listening on port 3001');
});

