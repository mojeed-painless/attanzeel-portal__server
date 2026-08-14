const mongoose = require('mongoose');

const billItemSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    malePrice: { type: Number, default: 0 },
    femalePrice: { type: Number, default: 0 },
    category: { type: String, default: 'left' },
  },
  { _id: false }
);

const billSchema = new mongoose.Schema(
  {
    items: [billItemSchema],
    accountNumber: { type: String },
    bankName: { type: String },
    accountName: { type: String },
    accountType: { type: String },
    updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Bill', billSchema);
