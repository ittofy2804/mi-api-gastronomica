const mysql = require('mysql2/promise');
const config = require('../env/mysqlConfig');
const memoryStore = require('./memoryStore');

let pool = null;
let memoryMode = false;

async function ensureConnection() {
  if (pool) return true;

  try {
    pool = mysql.createPool(config);
    await pool.query('SELECT 1');
    memoryMode = false;
    return true;
  } catch (error) {
    pool = null;
    memoryMode = true;
    return false;
  }
}

const db = {
  inMemoryMode: () => memoryMode,

  async list(table) {
    if (await ensureConnection()) {
      const [rows] = await pool.query(`SELECT * FROM ${table}`);
      return rows;
    }
    return memoryStore.list(table);
  },

  async findById(table, id) {
    if (await ensureConnection()) {
      const [rows] = await pool.query(`SELECT * FROM ${table} WHERE id = ?`, [id]);
      return rows[0] || null;
    }
    return memoryStore.getById(table, id);
  },

  async findByField(table, fieldName, value) {
    if (await ensureConnection()) {
      const [rows] = await pool.query(`SELECT * FROM ${table} WHERE ${fieldName} = ?`, [value]);
      return rows[0] || null;
    }
    return memoryStore.findOneByField(table, fieldName, value);
  },

  async findByEmail(email) {
    return this.findByField('users', 'email', email);
  },

  async create(table, payload) {
    if (await ensureConnection()) {
      const columns = Object.keys(payload);
      const values = Object.values(payload);
      const placeholders = columns.map(() => '?').join(', ');
      const sql = `INSERT INTO ${table} (${columns.join(', ')}) VALUES (${placeholders})`;
      const [result] = await pool.query(sql, values);
      return { id: result.insertId, ...payload };
    }
    return memoryStore.create(table, payload);
  },

  async update(table, id, payload) {
    if (await ensureConnection()) {
      const fields = Object.keys(payload)
        .map((key) => `${key} = ?`)
        .join(', ');
      const values = [...Object.values(payload), id];
      await pool.query(`UPDATE ${table} SET ${fields} WHERE id = ?`, values);
      return this.findById(table, id);
    }
    return memoryStore.update(table, id, payload);
  },

  async remove(table, id) {
    if (await ensureConnection()) {
      const [result] = await pool.query(`DELETE FROM ${table} WHERE id = ?`, [id]);
      return result.affectedRows > 0;
    }
    return memoryStore.remove(table, id);
  }
};

module.exports = db;