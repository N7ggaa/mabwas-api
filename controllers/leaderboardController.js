export const getLeaderboard = async (req, res) => {
  try {
    // This is mock data. We will connect this to a real database model later.
    const mockLeaderboard = [
      { rank: 1, username: 'RacerX', score: 9500 },
      { rank: 2, username: 'SpeedDemon', score: 9100 },
      { rank: 3, username: 'DriftKing', score: 8800 },
      { rank: 4, username: 'User123', score: 8500 },
      { rank: 5, username: 'Newbie', score: 7200 },
    ];

    res.json({
      message: 'Leaderboard retrieved (mock)',
      leaderboard: mockLeaderboard
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to retrieve leaderboard' });
  }
};