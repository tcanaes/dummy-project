import catchAsync from '../utils/catchAsync';
import AppError from '../utils/appError';
import APIFeatures from '../utils/apiFeatures';

export default {
  deleteOne: (Model) =>
    catchAsync(async (req, res, next) => {
      const doc = await Model.findByIdAndDelete(req.params.id);

      if (!doc) {
        return next(new AppError('No document found with that ID', 404));
      }

      res.status(204).json({
        status: 'success',
        data: null,
      });
    }),

  updateOne: (Model) =>
    catchAsync(async (req, res, next) => {
      const doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
      });

      if (!doc) {
        return next(new AppError('No document found with that ID', 404));
      }

      res.status(201).json({
        status: 'success',
        data: { data: doc },
      });
    }),

  createOne: (Model) =>
    catchAsync(async (req, res, next) => {
      const doc = await Model.create(req.body);
      res.status(201).json({
        status: 'success',
        data: { data: doc },
      });
    }),

  getOne: (Model, popOptions) =>
    catchAsync(async (req, res, next) => {
      let query = Model.findById(req.params.id);
      if (popOptions) query = query.populate(popOptions);
      const doc = await query;

      if (!doc) {
        return next(new AppError('No document found with that ID', 404));
      }

      res.status(200).json({
        status: 'success',
        results: doc.length,
        requestedAt: req.requestTime,
        data: { data: doc },
      });
    }),

  getAll: (Model) =>
    catchAsync(async (req, res, next) => {
      let filter = {};
      if (req.params.tourId) filter = { tour: req.params.tourId };

      // Execute Query
      const features = new APIFeatures(Model.find(filter), req.query)
        .filter()
        .sort()
        .limitFields()
        .paginate();
      const docs = await features.query;

      res.status(200).json({
        status: 'success',
        results: docs.length,
        requestedAt: req.requestTime,
        data: { docs },
      });
    }),
};
