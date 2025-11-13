// backend/routes/officer.js
const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const role = require('../middleware/roleMiddleware');
const LoanApplication = require('../models/LoanApplication');
const LoanOfficer = require('../models/LoanOfficer');
const User = require('../models/User'); // to read officer name if needed

async function getOfficerDoc(userId) {
  return await LoanOfficer.findOne({ userId });
}

// Get pending loans (OFFICER only)
router.get('/loans/pending', auth, role(['OFFICER']), async (req, res) => {
  try {
    const pending = await LoanApplication.find({ status: 'PENDING' })
      .populate({ path: 'customerId', populate: { path: 'userId', select: 'name email' } })
      .populate({ path: 'officerComments.officerId', populate: { path: 'userId', select: 'name' } });
    return res.json(pending);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
});

// Review loan - approve/reject + optional comment
router.post('/loans/:id/review', auth, role(['OFFICER']), async (req, res) => {
  try {
    const { action, comment } = req.body; // action required, comment optional
    if (!['APPROVE','REJECT'].includes(action)) return res.status(400).json({ message: 'Invalid action' });

    const loan = await LoanApplication.findById(req.params.id);
    if (!loan) return res.status(404).json({ message: 'Not found' });

    const officerDoc = await getOfficerDoc(req.user.userId);
    let officerName = req.fullUser?.name || 'Officer';
    if (officerDoc) {
      // record that this officer reviewed it
      if (!loan.officerIds) loan.officerIds = [];
      if (!loan.officerIds.some(id => id.equals(officerDoc._id))) {
        loan.officerIds.push(officerDoc._id);
      }
      loan.assignedOfficerId = officerDoc._id;
      // prepare officer name if possible (user info)
      try {
        const user = await User.findById(req.user.userId);
        if (user) officerName = user.name;
      } catch (e) { /* ignore */ }
    }

    // Add comment if provided
    if (comment && comment.trim().length > 0) {
      loan.officerComments = loan.officerComments || [];
      loan.officerComments.push({
        officerId: officerDoc ? officerDoc._id : undefined,
        officerName,
        text: comment.trim(),
        createdAt: new Date()
      });
    }

    // Set final status (officer is authoritative)
    loan.status = action === 'APPROVE' ? 'APPROVED' : 'REJECTED';

    await loan.save();

    // Return populated updated loan
    const updated = await LoanApplication.findById(loan._id)
      .populate({ path: 'customerId', populate: { path: 'userId', select: 'name email' } });
    return res.json({ message: `Loan ${loan.status.toLowerCase()}.`, loan: updated });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
