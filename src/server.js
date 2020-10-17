import dotenv from 'dotenv';
import './setup/db';

import app from './app';
const server = app.listen(process.env.SERVER_PORT, () => {
  console.log(`Server running o port ${process.env.SERVER_PORT}...`);
});

//Global error handler (non async)
process.on('unhandledRejection', (err) => {
  console.log(err.name, err.message);
  server.close(() => {
    process.exit(1); //0 = sucess, 1 = unhandledRejection
  });
});
