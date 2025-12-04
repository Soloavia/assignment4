import { db } from "./database";

export function initDb(): void {
  const ddl = `
    CREATE TABLE IF NOT EXISTS accounts (
      account_number INTEGER PRIMARY KEY,
      client_name TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS activities (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      account_number INTEGER NOT NULL,
      action_name TEXT NOT NULL CHECK(action_name IN ('draw','deposit','loan')),
      sum REAL NOT NULL,
      date TEXT NOT NULL,
      interest REAL,
      payments INTEGER,
      FOREIGN KEY(account_number) REFERENCES accounts(account_number) ON DELETE CASCADE
    );
  `;

  db.exec(ddl, (err) => {
    if (err) {
      console.error("DB Init Error:", err);
      return;
    }
    console.log("✓ DB schema ready");
    seedData();
  });
}

function seedData(): void {
  db.get("SELECT COUNT(*) AS count FROM accounts", (err, row: any) => {
    if (err) {
      console.error("Seed check failed:", err);
      return;
    }
    if (row && row.count > 0) {
      console.log("✓ Seed skipped (data already present)");
      return;
    }

    console.log("✓ Inserting demo data...");

    const accountInserts = `
      INSERT INTO accounts (account_number, client_name) VALUES
      (1001, 'John Doe'),
      (1002, 'Sarah Miller'),
      (1003, 'David Cohen'),
      (1004, 'Emma Lewis'),
      (1005, 'Daniel Garcia'),
      (1006, 'Olivia Martinez'),
      (1007, 'Noah Brown'),
      (1008, 'Sophia Davis'),
      (1009, 'James Wilson'),
      (1010, 'Mia Thompson');
    `;

    const activityInserts = `
      INSERT INTO activities (account_number, action_name, sum, date, interest, payments) VALUES
      (1001, 'deposit', 1200, '2025-01-05T09:00:00.000Z', NULL, NULL),
      (1002, 'draw', -150, '2025-01-06T10:00:00.000Z', NULL, NULL),
      (1003, 'loan', 5000, '2025-01-07T11:00:00.000Z', 4.5, 24),
      (1004, 'deposit', 300, '2025-01-08T12:00:00.000Z', NULL, NULL),
      (1005, 'draw', -50, '2025-01-09T13:00:00.000Z', NULL, NULL),
      (1006, 'loan', 10000, '2025-01-10T14:00:00.000Z', 3.75, 36),
      (1007, 'deposit', 800, '2025-01-11T15:00:00.000Z', NULL, NULL),
      (1008, 'loan', 2000, '2025-01-12T16:00:00.000Z', 5.2, 12),
      (1009, 'draw', -400, '2025-01-13T17:00:00.000Z', NULL, NULL),
      (1010, 'loan', 7500, '2025-01-14T18:00:00.000Z', 4.9, 18);
    `;

    db.exec(accountInserts + activityInserts, (seedErr) => {
      if (seedErr) {
        console.error("Seed insert error:", seedErr);
      } else {
        console.log("✓ Demo data inserted");
      }
    });
  });
}
