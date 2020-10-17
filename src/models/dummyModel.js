import mongoose from 'mongoose';
import validator from 'validator';

const dummySchema = new mongoose.Schema(
  {
    email: {
      type: String,
      unique: true,
      required: [true, 'Please, inform your email address'],
      validate: [validator.isEmail, 'Invalid email'],
    },

    name: {
      type: String,
      required: [true, 'Please, inform your name.'],
      match: [
        //XSS protection, since xss-clean package is to old
        new RegExp(/^[a-zA-Z\s]+$/),
        '{VALUE} is invalid. Please use only letters.',
      ],
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true, getters: true },
    toObject: { virtuals: true, getters: true },
  }
);

const Dummy = mongoose.model('Dummy', dummySchema);

export default Dummy;
