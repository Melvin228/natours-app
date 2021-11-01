const dotenv = require('dotenv');
const mongoose = require('mongoose');

process.on('uncaughtException', err => {
  console.log('UNCAUGHT EXCEPTION! Shutting Down...');
  console.log(err);
  console.log(err.name, err.message);
  process.exit(1);
});

const app = require('./app');

dotenv.config({ path: './config.env' });

///////Start SERVER///////////
const port = process.env.PORT || 5000;
const server = app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});

const DB = process.env.DATABASE.replace(
  '<password>',
  process.env.DATABASE_PASSWORD
);

mongoose
  .connect(DB, {
    useNewUrlParser: true
  })
  .then(() => console.log('DB connection successful!'));

process.on('unhandledRejection', err => {
  console.log(err.name, err.message);
  console.log('UNHANDLED REJECTION! Shutting down the server');
  server.close(() => {
    process.exit(1);
  });
});
