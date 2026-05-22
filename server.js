const express = require('express');
const cors = require('cors');
const initSqlJs = require('sql.js');
const path = require('path');
const fs = require('fs');
const { categories, queries } = require('./data');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

const publicPath = path.join(__dirname, 'public');
if (fs.existsSync(publicPath)) {
  app.use(express.static(publicPath));
}

let db;

function queryAll(sql, params = []) {
  const stmt = db.prepare(sql);
  if (params.length > 0) stmt.bind(params);
  const rows = [];
  while (stmt.step()) {
    rows.push(stmt.getAsObject());
  }
  stmt.free();
  return rows;
}

function queryOne(sql, params = []) {
  const rows = queryAll(sql, params);
  return rows.length > 0 ? rows[0] : null;
}

async function initDb() {
  const SQL = await initSqlJs();
  const dbPath = path.join(__dirname, 'sql_learn.db');

  if (fs.existsSync(dbPath)) {
    const buffer = fs.readFileSync(dbPath);
    db = new SQL.Database(buffer);
  } else {
    console.log('Seeding database...');
    db = new SQL.Database();
    seedDatabase();
    const data = db.export();
    fs.writeFileSync(dbPath, Buffer.from(data));
    console.log('Database ready');
  }

  db.run('PRAGMA journal_mode=WAL');

  app.get('/api/categories', (req, res) => {
    res.json(queryAll('SELECT * FROM categories ORDER BY level, name'));
  });

  app.get('/api/categories/:id', (req, res) => {
    const cat = queryOne('SELECT * FROM categories WHERE id = ?', [req.params.id]);
    if (!cat) return res.status(404).json({ error: 'Not found' });
    res.json(cat);
  });

  app.get('/api/queries', (req, res) => {
    const { category_id, difficulty, dbms } = req.query;
    let sql = 'SELECT q.*, c.name as category_name, c.color as category_color FROM queries q JOIN categories c ON q.category_id = c.id';
    const conditions = [];
    const params = [];

    if (category_id) { conditions.push('q.category_id = ?'); params.push(category_id); }
    if (difficulty) { conditions.push('q.difficulty = ?'); params.push(difficulty); }
    if (conditions.length > 0) sql += ' WHERE ' + conditions.join(' AND ');
    sql += ' ORDER BY q.id';

    const results = queryAll(sql, params);
    res.json(results);
  });

  app.get('/api/queries/:id', (req, res) => {
    const q = queryOne(
      'SELECT q.*, c.name as category_name, c.color as category_color FROM queries q JOIN categories c ON q.category_id = c.id WHERE q.id = ?',
      [req.params.id]
    );
    if (!q) return res.status(404).json({ error: 'Not found' });
    res.json(q);
  });

  app.get('*', (req, res) => {
    if (!req.path.startsWith('/api')) {
      const indexPath = path.join(publicPath, 'index.html');
      if (fs.existsSync(indexPath)) return res.sendFile(indexPath);
    }
    res.status(404).json({ error: 'Not found' });
  });

  app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something went wrong!' });
  });

  app.listen(PORT, () => {
    console.log(`Shikav [by Kavish Ghumre] running on http://localhost:${PORT}`);
  });
}

function seedDatabase() {
  db.run('CREATE TABLE IF NOT EXISTS categories (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL, description TEXT, icon TEXT, level INTEGER NOT NULL, color TEXT)');
  db.run('CREATE TABLE IF NOT EXISTS queries (id INTEGER PRIMARY KEY AUTOINCREMENT, category_id INTEGER NOT NULL, title TEXT NOT NULL, description TEXT, sql_code TEXT NOT NULL, mysql_code TEXT, postgres_code TEXT, oracle_code TEXT, explanation TEXT, result_example TEXT, difficulty TEXT, question TEXT, question_answer TEXT, FOREIGN KEY (category_id) REFERENCES categories(id))');

  for (const c of categories) {
    db.run('INSERT INTO categories (name, description, icon, level, color) VALUES (?, ?, ?, ?, ?)',
      [c.name, c.description, c.icon, c.level, c.color]);
  }

  for (const q of queries) {
    db.run('INSERT INTO queries (category_id, title, description, sql_code, mysql_code, postgres_code, oracle_code, explanation, result_example, difficulty, question, question_answer) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [q.category_id, q.title, q.description || null, q.sql_code, q.mysql_code || null, q.postgres_code || null, q.oracle_code || null, q.explanation || null, q.result_example || null, q.difficulty, q.question || null, q.question_answer || null]);
  }
}

initDb().catch(err => {
  console.error('Failed to initialize:', err);
  process.exit(1);
});
