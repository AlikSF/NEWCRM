import initSqlJs, { Database } from 'sql.js';

let db: Database | null = null;
let initPromise: Promise<Database> | null = null;

const DB_NAME = 'tourcrm_db';

async function initDatabase(): Promise<Database> {
  if (db) return db;
  if (initPromise) return initPromise;

  initPromise = (async () => {
    const SQL = await initSqlJs({
      locateFile: file => `https://sql.js.org/dist/${file}`
    });

    const savedDb = localStorage.getItem(DB_NAME);
    if (savedDb) {
      const uint8Array = new Uint8Array(JSON.parse(savedDb));
      db = new SQL.Database(uint8Array);
    } else {
      db = new SQL.Database();
      await createTables();
    }

    return db;
  })();

  return initPromise;
}

async function createTables() {
  if (!db) return;

  db.run(`
    CREATE TABLE IF NOT EXISTS organizations (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      logo_url TEXT,
      primary_color TEXT DEFAULT '#4F46E5',
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS leads (
      id TEXT PRIMARY KEY,
      organization_id TEXT NOT NULL,
      name TEXT NOT NULL,
      email TEXT,
      phone TEXT,
      status TEXT DEFAULT 'new',
      channel TEXT DEFAULT 'website',
      last_message_time TEXT,
      notes TEXT,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (organization_id) REFERENCES organizations(id)
    );

    CREATE TABLE IF NOT EXISTS tours (
      id TEXT PRIMARY KEY,
      organization_id TEXT NOT NULL,
      name TEXT NOT NULL,
      location TEXT NOT NULL,
      duration TEXT NOT NULL,
      price REAL NOT NULL DEFAULT 0,
      status TEXT DEFAULT 'active',
      description TEXT,
      max_group_size INTEGER,
      level TEXT,
      tags TEXT,
      images TEXT,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (organization_id) REFERENCES organizations(id)
    );

    CREATE TABLE IF NOT EXISTS bookings (
      id TEXT PRIMARY KEY,
      organization_id TEXT NOT NULL,
      tour_id TEXT,
      lead_id TEXT,
      client_name TEXT NOT NULL,
      client_email TEXT,
      client_phone TEXT,
      people INTEGER NOT NULL DEFAULT 1,
      date TEXT NOT NULL,
      status TEXT DEFAULT 'pending',
      notes TEXT,
      pickup_location TEXT,
      total_price REAL,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (organization_id) REFERENCES organizations(id),
      FOREIGN KEY (tour_id) REFERENCES tours(id),
      FOREIGN KEY (lead_id) REFERENCES leads(id)
    );

    CREATE TABLE IF NOT EXISTS inbox_threads (
      id TEXT PRIMARY KEY,
      organization_id TEXT NOT NULL,
      lead_id TEXT,
      sender_name TEXT NOT NULL,
      channel TEXT DEFAULT 'website',
      status TEXT DEFAULT 'active',
      unread INTEGER DEFAULT 1,
      preview TEXT,
      last_time TEXT DEFAULT CURRENT_TIMESTAMP,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (organization_id) REFERENCES organizations(id),
      FOREIGN KEY (lead_id) REFERENCES leads(id)
    );

    CREATE TABLE IF NOT EXISTS inbox_messages (
      id TEXT PRIMARY KEY,
      organization_id TEXT NOT NULL,
      thread_id TEXT NOT NULL,
      sender TEXT NOT NULL,
      text TEXT NOT NULL,
      sent_at TEXT DEFAULT CURRENT_TIMESTAMP,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (organization_id) REFERENCES organizations(id),
      FOREIGN KEY (thread_id) REFERENCES inbox_threads(id)
    );

    CREATE TABLE IF NOT EXISTS notifications (
      id TEXT PRIMARY KEY,
      organization_id TEXT NOT NULL,
      type TEXT NOT NULL,
      title TEXT NOT NULL,
      body TEXT NOT NULL,
      is_read INTEGER DEFAULT 0,
      metadata TEXT,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (organization_id) REFERENCES organizations(id)
    );
  `);

  saveDatabase();
}

function saveDatabase() {
  if (!db) return;
  const data = db.export();
  const buffer = JSON.stringify(Array.from(data));
  localStorage.setItem(DB_NAME, buffer);
}

function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

export const localDB = {
  async query<T>(sql: string, params: any[] = []): Promise<T[]> {
    const database = await initDatabase();
    const stmt = database.prepare(sql);
    stmt.bind(params);

    const results: T[] = [];
    while (stmt.step()) {
      const row = stmt.getAsObject();
      results.push(row as T);
    }
    stmt.free();

    return results;
  },

  async execute(sql: string, params: any[] = []): Promise<void> {
    const database = await initDatabase();
    database.run(sql, params);
    saveDatabase();
  },

  async insert(table: string, data: Record<string, any>): Promise<string> {
    const id = data.id || generateId();
    const keys = Object.keys(data);
    const values = Object.values(data);

    const placeholders = keys.map(() => '?').join(', ');
    const sql = `INSERT INTO ${table} (id, ${keys.join(', ')}) VALUES (?, ${placeholders})`;

    await this.execute(sql, [id, ...values]);
    return id;
  },

  async update(table: string, id: string, data: Record<string, any>): Promise<void> {
    const keys = Object.keys(data);
    const values = Object.values(data);

    const setClause = keys.map(key => `${key} = ?`).join(', ');
    const sql = `UPDATE ${table} SET ${setClause}, updated_at = CURRENT_TIMESTAMP WHERE id = ?`;

    await this.execute(sql, [...values, id]);
  },

  async delete(table: string, id: string): Promise<void> {
    await this.execute(`DELETE FROM ${table} WHERE id = ?`, [id]);
  },

  async getById<T>(table: string, id: string): Promise<T | null> {
    const results = await this.query<T>(`SELECT * FROM ${table} WHERE id = ?`, [id]);
    return results[0] || null;
  },

  async getAll<T>(table: string, where?: string, params: any[] = []): Promise<T[]> {
    const sql = where
      ? `SELECT * FROM ${table} WHERE ${where}`
      : `SELECT * FROM ${table}`;
    return this.query<T>(sql, params);
  },

  generateId
};
