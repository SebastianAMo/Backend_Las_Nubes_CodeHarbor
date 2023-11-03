const pool = require('../../config/dbConfig');
const bcrypt = require('bcryptjs');



const getUsers = async (req, res) => {
  try {
    const result = await pool.query('SELECT id, username, role, created_at, estate FROM users');
    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

const getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('SELECT id, username, role, created_at, estate FROM users WHERE id = $1', [id]);
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

const createUser = async (req, res) => {
  try {
    const { username, password, role, estate } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await pool.query('INSERT INTO users (username, password, role, estate) VALUES ($1, $2, $3, $4) RETURNING *', [username, hashedPassword, role, estate]);
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { username, password, role, estate } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await pool.query('UPDATE users SET username = $1, password = $2, role = $3, estate = $4 WHERE id = $5 RETURNING *', [username, hashedPassword, role, estate, id]);
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query('DELETE FROM users WHERE id = $1', [id]);
    res.json({ msg: 'User deleted' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

module.exports = {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
};
