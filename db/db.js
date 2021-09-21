const mongoose = require('mongoose');
const config = require('../config');
const { db: { host, port, dbName } } = config;
const connectionString = `mongodb://${host}:${port}/${dbName}`

// db connection
const connectDB = async () => {
  try {
    await mongoose.connect(connectionString)
  } catch (err) {
    console.error(err);
  }
}

connectDB();
const db = mongoose.connection;

db.on('error', (err) => {
  console.error(err);
});

db.once('open', () => {
  console.log('Connected to MongoDB');
});


module.exports = {
  db,
  connect: () => {
    mongoose.Promise = Promise;
    mongoose.connect(connectionString);
  },
  disconnect: done => {
    mongoose.disconnect(done);
  }
}