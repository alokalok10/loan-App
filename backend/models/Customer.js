const { Schema, model } = require('mongoose');

const CustomerSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  income: { type: Number, default: 0 },
  creditScore: { type: Number, default: 600 }
});

module.exports = model('Customer', CustomerSchema);
