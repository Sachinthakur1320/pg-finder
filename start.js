require('dotenv').config();
const mongoose = require('mongoose');
mongoose.connect(process.env.DATABASE, { useNewUrlParser: true }).then(()=>console.log('Connected to moongobd'));
mongoose.Promise = global.Promise;

require('./models/Registration');
const app = require('./app');
const server = app.listen(8000, () => {
    console.log(`Express is running on port ${server.address().port}`);
  });