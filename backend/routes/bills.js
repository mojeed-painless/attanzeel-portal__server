const express = require('express');
const Bill = require('../models/Bill');
const { authMiddleware, authorize } = require('../middleware/auth');

const router = express.Router();

// Create a sensible default set of bill items matching the frontend defaults
const defaultItems = [
  { name: 'UNIFORM', malePrice: 9000, femalePrice: 10000, category: 'left' },
  { name: "JUM'AH WEARS", malePrice: 9000, femalePrice: 10000, category: 'left' },
  { name: 'SPORT WEAR', malePrice: 9000, femalePrice: 10000, category: 'left' },
  { name: 'CARDIGAN', malePrice: 6500, femalePrice: 6500, category: 'left' },
  { name: 'TRANSPORTATION', malePrice: 0, femalePrice: 0, category: 'left' },

  { name: 'TUITION FEE', malePrice: 21500, femalePrice: 21500, category: 'right' },
  { name: 'DEVELOPMENTAL FEE', malePrice: 500, femalePrice: 500, category: 'right' },
  { name: 'EXAMINATION FEE', malePrice: 1500, femalePrice: 1500, category: 'right' },
  { name: 'P.T.A LEVIES', malePrice: 500, femalePrice: 500, category: 'right' },
  { name: 'REPORT CARD FEE', malePrice: 500, femalePrice: 500, category: 'right' },
];

/**
 * GET /api/bills/:grade
 * Return the Bill document for a specific grade (create default if missing)
 */
router.get('/:grade', async (req, res) => {
  try {
    const grade = decodeURIComponent(req.params.grade || '').trim();

    if (!grade) {
      return res.status(400).json({ success: false, message: 'Grade is required' });
    }

    let bill = await Bill.findOne({ grade });

    if (!bill) {
      bill = new Bill({
        grade,
        items: defaultItems,
        accountNumber: '0004875547',
        bankName: 'JAIZ BANK',
        accountName: 'MARKAZ AT-TANZEEL AL-ISLAMIYY',
        accountType: 'CURRENT',
      });

      await bill.save();
    }

    return res.status(200).json({ success: true, bill });
  } catch (error) {
    console.error('Error fetching bill:', error);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
});

/**
 * PUT /api/bills/:grade
 * Update bill document for a specific grade (admin only)
 */
router.put('/:grade', authMiddleware, authorize('admin'), async (req, res) => {
  try {
    const grade = decodeURIComponent(req.params.grade || '').trim();
    const payload = req.body;

    if (!grade) {
      return res.status(400).json({ success: false, message: 'Grade is required' });
    }

    let bill = await Bill.findOne({ grade });

    if (!bill) {
      bill = new Bill({ ...payload, grade });
    } else {
      // Replace fields that are allowed to be updated
      bill.items = payload.items || bill.items;
      bill.accountNumber = payload.accountNumber ?? bill.accountNumber;
      bill.bankName = payload.bankName ?? bill.bankName;
      bill.accountName = payload.accountName ?? bill.accountName;
      bill.accountType = payload.accountType ?? bill.accountType;
    }

    bill.updatedBy = req.user.id;
    await bill.save();

    return res.status(200).json({ success: true, bill });
  } catch (error) {
    console.error('Error updating bill:', error);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;
