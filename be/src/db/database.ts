import sqlite3 from "sqlite3";
import path from "path";
import fs from "fs";

const dbDir = path.join(__dirname, "..", "..", "database");
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

const dbPath = path.join(dbDir, "bank.db");

sqlite3.verbose();

export const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error("Failed to open SQLite database:", err);
  } else {
    console.log("SQLite DB opened at", dbPath);
    db.run("PRAGMA foreign_keys = ON");
  }
});
