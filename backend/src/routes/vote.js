const express = require('express');
const Vote = require('../models/Vote');
const User = require('../models/User');
const auth = require('../middleware/auth');

const router = express.Router();
const MAX_VOTES = 4;

// Cast a vote
router.post('/', auth, async (req, res) => {
  try {
    const { to_user, message } = req.body;
    const now = new Date();
    const month = now.getMonth() + 1;
    const year = now.getFullYear();

    if (to_user === req.user._id.toString()) {
      return res.status(400).json({ message: 'Cannot vote for yourself' });
    }

    const count = await Vote.countDocuments({ from_user: req.user._id, month, year });
    if (count >= MAX_VOTES) {
      return res.status(400).json({ message: 'Vote limit reached for this month' });
    }

    const existing = await Vote.findOne({ from_user: req.user._id, to_user, month, year });
    if (existing) {
      return res.status(400).json({ message: 'Already voted for this person this month' });
    }

    await Vote.create({ from_user: req.user._id, to_user, month, year, message, status: 'approved' });
    res.status(201).json({ message: 'Vote cast successfully' });
  } catch (error) {
    console.error('Vote error:', error);
    res.status(500).json({ message: 'Failed to cast vote' });
  }
});

// Get my votes
router.get('/my', auth, async (req, res) => {
  try {
    const now = new Date();
    const month = now.getMonth() + 1;
    const year = now.getFullYear();

    const votes = await Vote.find({ from_user: req.user._id, month, year }).populate('to_user', 'name email group');
    res.json({
      votes,
      votes_cast: votes.length,
      max_votes: MAX_VOTES,
      remaining_votes: MAX_VOTES - votes.length
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to get votes' });
  }
});

// Get eligible recipients
router.get('/eligible-recipients', auth, async (req, res) => {
  try {
    const now = new Date();
    const month = now.getMonth() + 1;
    const year = now.getFullYear();

    const users = await User.find({ status: 'active', _id: { $ne: req.user._id } }).select('name email group');
    const myVotes = await Vote.find({ from_user: req.user._id, month, year }).select('to_user');
    const votedIds = myVotes.map(v => v.to_user.toString());

    const result = users.map(u => ({
      _id: u._id,
      name: u.name,
      email: u.email,
      group: u.group,
      already_voted: votedIds.includes(u._id.toString())
    }));

    res.json({ users: result });
  } catch (error) {
    res.status(500).json({ message: 'Failed to get recipients' });
  }
});

module.exports = router;
