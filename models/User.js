import pkg from 'mongoose';
const { Schema, model } = pkg;

const UserSchema = new Schema({
  name: {
    type: String,
    required: true,
    min: 6,
    max: 255,
  },
  email: {
    type: String,
    required: true,
    min: 6,
    max: 255,
  },
  password: {
    type: String,
    required: true,
    min: 6,
    max: 1024,
  },
  isAdmin: {
    type: Boolean,
    default: false,
    required: true,
  },
  balance: {
    type: Number,
    default: 100,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

export default model('User', UserSchema);