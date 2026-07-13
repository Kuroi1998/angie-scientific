import express from 'express';
import cors from 'cors';
import { getDb } from './db';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Get User Profile
app.get('/api/users/:userId', async (req, res) => {
  try {
    const db = await getDb();
    const { userId } = req.params;
    
    let user = await db.get('SELECT * FROM users WHERE id = ?', [userId]);
    
    if (!user) {
      // Auto-create a temporary anonymous profile if not exists (for child UX simplicity)
      await db.run(
        `INSERT INTO users (id, username) VALUES (?, ?)`,
        [userId, `Apprenti_${userId.substring(0,4)}`]
      );
      await db.run(`INSERT INTO user_progress (userId) VALUES (?)`, [userId]);
      user = await db.get('SELECT * FROM users WHERE id = ?', [userId]);
    }
    
    const progress = await db.get('SELECT * FROM user_progress WHERE userId = ?', [userId]);
    
    // Parse JSON arrays
    progress.discoveredElements = JSON.parse(progress.discoveredElements);
    progress.successfulReactions = JSON.parse(progress.successfulReactions);
    progress.completedQuests = JSON.parse(progress.completedQuests);
    progress.unlockedBadges = JSON.parse(progress.unlockedBadges);
    progress.solvedRiddles = JSON.parse(progress.solvedRiddles);

    // Convert boolean integers from SQLite
    user.mascotEnabled = Boolean(user.mascotEnabled);
    user.mascotSoundEnabled = Boolean(user.mascotSoundEnabled);
    user.globalSoundEnabled = Boolean(user.globalSoundEnabled);
    user.reducedMotion = Boolean(user.reducedMotion);

    res.json({ profile: user, progress });
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update Profile
app.put('/api/users/:userId', async (req, res) => {
  try {
    const db = await getDb();
    const { userId } = req.params;
    const { learningLevel, mascotEnabled, mascotSoundEnabled, globalSoundEnabled, reducedMotion } = req.body;

    await db.run(
      `UPDATE users 
       SET learningLevel = ?, mascotEnabled = ?, mascotSoundEnabled = ?, globalSoundEnabled = ?, reducedMotion = ?
       WHERE id = ?`,
      [learningLevel, mascotEnabled ? 1 : 0, mascotSoundEnabled ? 1 : 0, globalSoundEnabled ? 1 : 0, reducedMotion ? 1 : 0, userId]
    );

    res.json({ success: true });
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update Progress
app.put('/api/progress/:userId', async (req, res) => {
  try {
    const db = await getDb();
    const { userId } = req.params;
    const { 
      discoveredElements, successfulReactions, completedQuests, 
      unlockedBadges, solvedRiddles, experiencePoints 
    } = req.body;

    await db.run(
      `UPDATE user_progress 
       SET discoveredElements = ?, successfulReactions = ?, completedQuests = ?, unlockedBadges = ?, solvedRiddles = ?, experiencePoints = ?
       WHERE userId = ?`,
      [
        JSON.stringify(discoveredElements),
        JSON.stringify(successfulReactions),
        JSON.stringify(completedQuests),
        JSON.stringify(unlockedBadges),
        JSON.stringify(solvedRiddles),
        experiencePoints,
        userId
      ]
    );

    res.json({ success: true });
  } catch (error) {
    console.error('Error updating progress:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.listen(PORT, () => {
  console.log(`✅ Angie Scientific Backend running on http://localhost:${PORT}`);
});
