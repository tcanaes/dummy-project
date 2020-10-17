//Models
import Dummy from '../models/dummyModel';

//Utils
import catchAsync from '../utils/catchAsync';
import factory from './handlerFactory';
import AppError from '../utils/appError';

export default {
  helloWorld: catchAsync(async (req, res, next) => {
    res.status(200).json({ status: 'success', message: 'Hello Cutie!' });
  }),
};
