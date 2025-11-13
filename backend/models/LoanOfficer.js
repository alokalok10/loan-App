const { Schema, model } = require('mongoose');

const LoanOfficerSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  branch: { type: String }
});

module.exports = model('LoanOfficer', LoanOfficerSchema);
