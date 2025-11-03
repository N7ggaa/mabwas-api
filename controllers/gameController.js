export const start = async (req, res) => {
  try {
    const { gameMode, difficulty } = req.body;
    console.log(`Game session started by user ${req.user.userId} in mode ${gameMode}`);
    res.json({
      message: 'Game session started (mock)',
      sessionId: `mock_session_${Date.now()}`,
      startTime: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to start game session' });
  }
};

export const end = async (req, res) => {
  try {
    const { sessionId, score } = req.body;
    console.log(`Game session ${sessionId} ended with score ${score}`);
    res.json({
      message: 'Game session ended (mock)',
      sessionId,
      finalScore: score,
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to end game session' });
  }
};