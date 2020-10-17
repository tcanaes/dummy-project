/******************************************************************************/
/*                              IMPORTING STUFF                               */
/******************************************************************************/
//Server
import express from 'express';
import cors from 'cors';
import compression from 'compression';
import path from 'path';
//Security
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import mongoSanitize from 'express-mongo-sanitize';
import hpp from 'hpp';
//Routers
import dummyRouter from './routes/dummyRouter';
//Controllers
import dummyController from './controllers/dummyController';
//Utils
import AppError from './utils/appError';

/******************************************************************************/
/*                             SETTING UP OPTIONS                             */
/******************************************************************************/
const app = express();

app.use(cors()); // Works only for simple requests: get and post
app.options('*', cors()); // Options is a pre-request of a complex request

//this middleware serve static files
app.use(express.static(path.join(__dirname, 'public')));

// Set security HTTP headers
app.use(helmet());
app.use(
  helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: ["'self'", 'https:', 'http:', 'data:', 'ws:'],
      baseUri: ["'self'"],
      fontSrc: ["'self'", 'https:', 'http:', 'data:'],
      scriptSrc: ["'self'", 'https:', 'http:', 'blob:'],
      styleSrc: ["'self'", 'https:', 'http:', 'unsafe-inline'],
    },
  })
);

//Prevent brute forece attacks
const limiter = rateLimit({
  max: 100, //Max num of requests from the same IP
  windowMs: 60 * 60 * 1000, //1 hour in milliseconds
  message: 'Too many requests from this IP. Please try again in an hour.',
});
app.use('/api', limiter); //it will affect all the URLs that starts with /API

//Body parser - need this middleware to receive the JSON data on REQUEST.BODY
app.use(express.json({ limit: '10kb' }));

//Data sanitization against NoSQL query injection
app.use(mongoSanitize());

//Prevent parameter polution
// app.use(
//   hpp({
//     whitelist: [
//       //Add fields to be accepted
//     ],
//   })
// );

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

app.use(compression());

/******************************************************************************/
/*                          EFFECTIVELY DOING STUFF                           */
/******************************************************************************/
//ROUTES
app.use('/api/v1/dummy', dummyRouter);

//Every request previous router were unable to catch
app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server.`, 404));
});

export default app;
