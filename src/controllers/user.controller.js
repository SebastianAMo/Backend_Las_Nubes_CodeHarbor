const pool = require('../../config/dbConfig');
const bcrypt = require('bcryptjs');

const createUser = async (userData) => {
  try {
    const { username, password, role} = userData;
    const estate = 'active';
    const createdAt = new Date();
    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await pool.query(
      'INSERT INTO users (username, password, role, estate, created_at) VALUES ($1, $2, $3, $4, $5) RETURNING id, username, role, created_at, estate', 
      [username, hashedPassword, role, estate, createdAt]
    );

    return { success: true, user: result.rows[0] };
  } catch (err) {
    console.error(err.message);
    return { success: false, error: err.message };
  }
};


const getUsers = async (req, res) => {
  try {
    const result = await pool.query('SELECT id, username, role, created_at, estate FROM users WHERE estate <> $1', ['deleted']);
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

const getDisabledUsers = async (req, res) => {
  try {
    const result = await pool.query("SELECT id, username, role, created_at, estate FROM users WHERE estate = $1", ['disabled']);
    res.json(result.rows);
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

const disabledUser = async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query('UPDATE users SET estate = $1 WHERE id = $2', ['disabled', id]);
    res.json({ msg: 'User state changed to disabled' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

const activeUser = async (req, res) => {
  try {
    const { id } = req.body;
    await pool.query('UPDATE users SET estate = $1 WHERE id = $2', ['active', id]);
    res.json({ msg: 'User state changed to active' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

const patchUser = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    const allowedUpdates = ['username', 'role', 'estate'];
    const updateKeys = Object.keys(updates).filter(key => allowedUpdates.includes(key));
    
    if (updateKeys.length === 0) {
      return res.status(400).send({ error: 'No valid fields provided for update' });
    }

    const setClause = updateKeys.map((key, index) => `${key} = $${index + 2}`).join(', ');
    const queryValues = updateKeys.map(key => updates[key]);
    queryValues.push(id); 
    const result = await pool.query(
      `UPDATE users SET ${setClause} WHERE id = $1 RETURNING id, username, role, created_at, estate`,
      [id, ...queryValues]
    );

    if (result.rows.length === 0) {
      return res.status(404).send({ error: 'User not found or is disabled' });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

module.exports = {
  createUser,
  getUsers,
  getUserById,
  getDisabledUsers,
  updateUser,
  disabledUser,
  activeUser,
  patchUser
};