const mongoose = require('mongoose');

const voteSchema = new mongoose.Schema({
  from_user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  to_user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  month: { type: Number, required: true },
  year: { type: Number, required: true },
  status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'approved' },
  message: { type: String }
}, { timestamps: true });

voteSchema.index({ from_user: 1, to_user: 1, month: 1, year: 1 }, { unique: true });

module.exports = mongoose.model('Vote', voteSchema);
