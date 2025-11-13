// backend/models/LoanApplication.js
const { Schema, model } = require('mongoose');

const OfficerCommentSchema = new Schema({
  officerId: { type: Schema.Types.ObjectId, ref: 'LoanOfficer' },
  officerName: { type: String },
  text: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
}, { _id: false });

const LoanApplicationSchema = new Schema({
  customerId: { type: Schema.Types.ObjectId, ref: 'Customer', required: true },
  officerIds: [{ type: Schema.Types.ObjectId, ref: 'LoanOfficer' }],
  assignedOfficerId: { type: Schema.Types.ObjectId, ref: 'LoanOfficer' },
  officerComments: [OfficerCommentSchema], // <-- new
  amountRequested: { type: Number, required: true },
  tenureMonths: { type: Number, required: true },
  interestRate: { type: Number },
  status: { type: String, enum: ['PENDING','APPROVED','REJECTED'], default: 'PENDING' },
  eligibilityScore: { type: Number }
}, { timestamps: true });

LoanApplicationSchema.index({ officerIds: 1 });

module.exports = model('LoanApplication', LoanApplicationSchema);
