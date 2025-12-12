import initSqlJs, { Database } from 'sql.js';

class LocalDatabase {
  private db: Database | null = null;
  private initialized = false;

  async init() {
    if (this.initialized) return;

    const SQL = await initSqlJs({
      locateFile: (file) => `https://sql.js.org/dist/${file}`,
    });

    const savedData = localStorage.getItem('tourcrm-db');
    if (savedData) {
      const uint8Array = new Uint8Array(JSON.parse(savedData));
      this.db = new SQL.Database(uint8Array);
    } else {
      this.db = new SQL.Database();
      this.createTables();
    }

    this.initialized = true;
  }

  private createTables() {
    if (!this.db) return;

    const schemas = [
      `CREATE TABLE IF NOT EXISTS organizations (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        logo_url TEXT,
        primary_color TEXT DEFAULT '#4F46E5',
        created_at TEXT DEFAULT CURRENT_TIMESTAMP,
        updated_at TEXT DEFAULT CURRENT_TIMESTAMP
      )`,
      `CREATE TABLE IF NOT EXISTS leads (
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
      )`,
      `CREATE TABLE IF NOT EXISTS tours (
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
        created_at TEXT DEFAULT CURRENT_TIMESTAMP,
        updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (organization_id) REFERENCES organizations(id)
      )`,
      `CREATE TABLE IF NOT EXISTS bookings (
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
      )`,
      `CREATE TABLE IF NOT EXISTS inbox_threads (
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
      )`,
      `CREATE TABLE IF NOT EXISTS inbox_messages (
        id TEXT PRIMARY KEY,
        organization_id TEXT NOT NULL,
        thread_id TEXT NOT NULL,
        sender TEXT NOT NULL,
        text TEXT NOT NULL,
        sent_at TEXT DEFAULT CURRENT_TIMESTAMP,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (organization_id) REFERENCES organizations(id),
        FOREIGN KEY (thread_id) REFERENCES inbox_threads(id)
      )`,
      `CREATE TABLE IF NOT EXISTS notifications (
        id TEXT PRIMARY KEY,
        organization_id TEXT NOT NULL,
        type TEXT NOT NULL,
        title TEXT NOT NULL,
        body TEXT NOT NULL,
        is_read INTEGER DEFAULT 0,
        metadata TEXT,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (organization_id) REFERENCES organizations(id)
      )`
    ];

    schemas.forEach(schema => {
      this.db!.run(schema);
    });

    this.save();
  }

  execute(sql: string, params: any[] = []): any[] {
    if (!this.db) throw new Error('Database not initialized');

    try {
      this.db.run(sql, params);
      this.save();
      return [];
    } catch (error) {
      console.error('SQL execution error:', error);
      throw error;
    }
  }

  query(sql: string, params: any[] = []): any[] {
    if (!this.db) throw new Error('Database not initialized');

    try {
      const results = this.db.exec(sql, params);
      if (results.length === 0) return [];

      const result = results[0];
      return result.values.map(row => {
        const obj: any = {};
        result.columns.forEach((col, i) => {
          obj[col] = row[i];
        });
        return obj;
      });
    } catch (error) {
      console.error('SQL query error:', error);
      throw error;
    }
  }

  getAll(table: string): any[] {
    return this.query(`SELECT * FROM ${table}`);
  }

  getById(table: string, id: string): any | null {
    const results = this.query(`SELECT * FROM ${table} WHERE id = ?`, [id]);
    return results.length > 0 ? results[0] : null;
  }

  insert(table: string, data: Record<string, any>): void {
    const columns = Object.keys(data).join(', ');
    const placeholders = Object.keys(data).map(() => '?').join(', ');
    const values = Object.values(data);

    this.execute(
      `INSERT INTO ${table} (${columns}) VALUES (${placeholders})`,
      values
    );
  }

  update(table: string, id: string, data: Record<string, any>): void {
    const setClause = Object.keys(data)
      .map(key => `${key} = ?`)
      .join(', ');
    const values = [...Object.values(data), id];

    this.execute(
      `UPDATE ${table} SET ${setClause} WHERE id = ?`,
      values
    );
  }

  delete(table: string, id: string): void {
    this.execute(`DELETE FROM ${table} WHERE id = ?`, [id]);
  }

  private save() {
    if (!this.db) return;

    const data = this.db.export();
    const dataArray = Array.from(data);
    localStorage.setItem('tourcrm-db', JSON.stringify(dataArray));
  }
}

export const localDB = new LocalDatabase();
