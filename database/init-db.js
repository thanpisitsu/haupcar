const { DatabaseSync } = require('node:sqlite');
const fs = require('node:fs');
const path = require('node:path');

const dbDir = path.resolve(__dirname);
const dbPath = path.join(dbDir, 'car.db');
const schemaPath = path.join(dbDir, 'schema.sql');

console.log(`Connecting to database at ${dbPath}...`);
const db = new DatabaseSync(dbPath);

const sql = fs.readFileSync(schemaPath, 'utf-8');
db.exec(sql);

const countStmt = db.prepare('SELECT COUNT(*) as count FROM cars');
const result = countStmt.get();
