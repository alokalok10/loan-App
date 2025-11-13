// backend/services/loanService.js
const LoanApplication = require('../models/LoanApplication');
const Customer = require('../models/Customer');

/**
 * This evaluateLoan computes eligibilityScore only.
 * It DOES NOT set status = APPROVED/REJECTED automatically.
 * That way final approval is always done by an officer.
 */
const normalize = (value, min, max) => {
  if (max === min) return 0;
  return Math.max(0, Math.min(1, (value - min) / (max - min)));
};

module.exports = {
  evaluateLoan: async function(applicationId) {
    const app = await LoanApplication.findById(applicationId);
    if (!app) throw new Error('Application not found');

    const customer = await Customer.findById(app.customerId);
    if (!customer) throw new Error('Customer not found');

    // Get dynamic min/max from Customer collection
    const agg = await Customer.aggregate([
      {
        $group: {
          _id: null,
          minIncome: { $min: { $ifNull: ["$income", 0] } },
          maxIncome: { $max: { $ifNull: ["$income", 0] } },
          minCredit: { $min: { $ifNull: ["$creditScore", 600] } },
          maxCredit: { $max: { $ifNull: ["$creditScore", 600] } }
        }
      }
    ]);

    let minIncome = 0, maxIncome = 2000000, minCredit = 300, maxCredit = 850;
    if (agg && agg.length) {
      minIncome = Math.min(0, agg[0].minIncome || 0);
      maxIncome = Math.max(agg[0].maxIncome || 2000000, 1);
      minCredit = Math.min(300, agg[0].minCredit || 300);
      maxCredit = Math.max(agg[0].maxCredit || 850, minCredit + 1);
    }

    const creditNorm = normalize(customer.creditScore || 600, minCredit, maxCredit);
    const incomeNorm = normalize(customer.income || 0, minIncome, maxIncome);

    const score = (0.6 * creditNorm) + (0.4 * incomeNorm);

    // Save eligibility score (rounded)
    app.eligibilityScore = Math.round(score * 100) / 100;

    // IMPORTANT: do NOT change app.status here — leave pending for officer decision
    await app.save();

    return app;
  }
};
