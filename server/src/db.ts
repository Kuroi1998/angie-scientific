import sqlite3 from 'sqlite3';
import { open, Database } from 'sqlite';
import path from 'path';
import fs from 'fs';

const dbPath = path.resolve(__dirname, '../../database');
if (!fs.existsSync(dbPath)) {
  fs.mkdirSync(dbPath, { recursive: true });
}

let dbInstance: Database | null = null;

export const getDb = async (): Promise<Database> => {
  if (dbInstance) return dbInstance;

  dbInstance = await open({
    filename: path.join(dbPath, 'angie_scientific.sqlite'),
    driver: sqlite3.Database
  });

  await dbInstance.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      username TEXT NOT NULL,
      learningLevel TEXT DEFAULT 'discovery',
      mascotEnabled BOOLEAN DEFAULT 1,
      mascotSoundEnabled BOOLEAN DEFAULT 1,
      globalSoundEnabled BOOLEAN DEFAULT 1,
      reducedMotion BOOLEAN DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS user_progress (
      userId TEXT PRIMARY KEY,
      discoveredElements TEXT DEFAULT '[]',
      successfulReactions TEXT DEFAULT '[]',
      completedQuests TEXT DEFAULT '[]',
      unlockedBadges TEXT DEFAULT '[]',
      solvedRiddles TEXT DEFAULT '[]',
      experiencePoints INTEGER DEFAULT 0,
      FOREIGN KEY (userId) REFERENCES users(id)
    );
  `);

  return dbInstance;
};
