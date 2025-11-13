// backend/routes/loans.js
const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const role = require('../middleware/roleMiddleware');
const LoanApplication = require('../models/LoanApplication');
const Customer = require('../models/Customer');
const LoanService = require('../services/loanService');

// Apply for loan - only CUSTOMER
router.post('/apply', auth, role(['CUSTOMER']), async (req, res) => {
  try {
    const userId = req.user.userId;
    const customerDoc = await Customer.findOne({ userId });
    if (!customerDoc) return res.status(400).json({ message: 'Customer profile not found' });

    const { amountRequested, tenureMonths } = req.body;
    if (!amountRequested || !tenureMonths) return res.status(400).json({ message: 'Missing fields' });

    const app = await LoanApplication.create({ customerId: customerDoc._id, amountRequested, tenureMonths, status: 'PENDING' });

    // Evaluate eligibility score only
    await LoanService.evaluateLoan(app._id);

    return res.json({ loanId: app._id, message: 'Loan application submitted and scored (pending officer review).' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
});

// Get status (any authenticated user can call)
router.get('/:id/status', auth, async (req, res) => {
  try {
    const app = await LoanApplication.findById(req.params.id);
    if (!app) return res.status(404).json({ message: 'Not found' });
    return res.json({ status: app.status, eligibilityScore: app.eligibilityScore });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
});

// Get all loans for current customer
router.get('/mine', auth, role(['CUSTOMER']), async (req, res) => {
  try {
    const userId = req.user.userId;
    const customerDoc = await Customer.findOne({ userId });
    if (!customerDoc) return res.status(400).json({ message: 'Customer profile not found' });

    const loans = await LoanApplication.find({ customerId: customerDoc._id }).sort({ createdAt: -1 })
      .populate({ path: 'officerComments.officerId', populate: { path: 'userId', select: 'name' } });

    return res.json(loans);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
});

/*
  UPDATE loan (Customer only)
  - Customer can update only their loan
  - Only allowed if status === 'PENDING'
  - Allowed fields: amountRequested, tenureMonths (you can extend)
  - Re-run LoanService.evaluateLoan to refresh eligibilityScore
*/
router.put('/:id', auth, role(['CUSTOMER']), async (req, res) => {
  try {
    const loan = await LoanApplication.findById(req.params.id);
    if (!loan) return res.status(404).json({ message: 'Loan not found' });

    // Verify ownership
    const customerDoc = await Customer.findOne({ userId: req.user.userId });
    if (!customerDoc || !loan.customerId.equals(customerDoc._id)) {
      return res.status(403).json({ message: 'Forbidden: not your loan' });
    }

    // Only allow update when pending
    if (loan.status !== 'PENDING') {
      return res.status(400).json({ message: 'Cannot update loan unless it is PENDING' });
    }

    const { amountRequested, tenureMonths } = req.body;
    let changed = false;
    if (amountRequested !== undefined) { loan.amountRequested = Number(amountRequested); changed = true; }
    if (tenureMonths !== undefined) { loan.tenureMonths = Number(tenureMonths); changed = true; }

    if (!changed) return res.status(400).json({ message: 'No updatable fields provided' });

    await loan.save();

    // Re-evaluate eligibility (score only)
    await LoanService.evaluateLoan(loan._id);

    const updated = await LoanApplication.findById(loan._id);
    return res.json({ message: 'Loan updated', loan: updated });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
});

/*
  DELETE loan (Customer only)
  - Customer can delete only their loan
  - Only allowed if status === 'PENDING'
*/
router.delete('/:id', auth, role(['CUSTOMER']), async (req, res) => {
  try {
    const loan = await LoanApplication.findById(req.params.id);
    if (!loan) return res.status(404).json({ message: 'Loan not found' });

    // Verify ownership
    const customerDoc = await Customer.findOne({ userId: req.user.userId });
    if (!customerDoc || !loan.customerId.equals(customerDoc._id)) {
      return res.status(403).json({ message: 'Forbidden: not your loan' });
    }

    // Only allow delete when pending
    if (loan.status !== 'PENDING') {
      return res.status(400).json({ message: 'Cannot delete loan unless it is PENDING' });
    }

    await LoanApplication.deleteOne({ _id: loan._id });
    return res.json({ message: 'Loan deleted' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
