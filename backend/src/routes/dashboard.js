const express = require('express');
const Vote = require('../models/Vote');
const auth = require('../middleware/auth');

const router = express.Router();
const PER_VOTE_AMOUNT = 100;
const MAX_VOTES = 4;

// Get my dashboard
router.get('/me', auth, async (req, res) => {
  try {
    const now = new Date();
    const month = now.getMonth() + 1;
    const year = now.getFullYear();

    const votesCast = await Vote.countDocuments({ from_user: req.user._id, month, year });
    const votesReceived = await Vote.countDocuments({ to_user: req.user._id, month, year, status: 'approved' });
    const totalReceived = await Vote.countDocuments({ to_user: req.user._id, status: 'approved' });

    res.json({
      currentMonth: {
        votes_cast: votesCast,
        max_votes: MAX_VOTES,
        votes_received: votesReceived,
        earnings: votesReceived * PER_VOTE_AMOUNT
      },
      summary: {
        total_earnings: totalReceived * PER_VOTE_AMOUNT
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to get dashboard' });
  }
});

// Get leaderboard
router.get('/leaderboard', auth, async (req, res) => {
  try {
    const now = new Date();
    const month = parseInt(req.query.month) || now.getMonth() + 1;
    const year = parseInt(req.query.year) || now.getFullYear();

    const leaderboard = await Vote.aggregate([
      { $match: { month, year, status: 'approved' } },
      { $group: { _id: '$to_user', votes_received: { $sum: 1 } } },
      { $sort: { votes_received: -1 } },
      { $limit: 20 },
      { $lookup: { from: 'users', localField: '_id', foreignField: '_id', as: 'user' } },
      { $unwind: '$user' },
      { $project: {
        user_id: '$_id',
        name: '$user.name',
        email: '$user.email',
        group: '$user.group',
        votes_received: 1,
        earnings: { $multiply: ['$votes_received', PER_VOTE_AMOUNT] }
      }}
    ]);

    res.json({
      leaderboard: leaderboard.map((e, i) => ({ ...e, rank: i + 1 })),
      month,
      year
    });
  } catch (error) {
    console.error('Leaderboard error:', error);
    res.status(500).json({ message: 'Failed to get leaderboard' });
  }
});

module.exports = router;
