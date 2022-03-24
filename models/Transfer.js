import pkg from 'mongoose';
const { Schema, model } = pkg;

const TransferSchema = new Schema({
  senderEmail: {
    type: String,
    required: true,
    min: 6,
    max: 255,
  },
  receiverEmail: {
    type: String,
    required: true,
    min: 6,
    max: 255,
  },
  details: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

export default model('Transfer', TransferSchema);