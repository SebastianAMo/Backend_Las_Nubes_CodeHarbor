const pool = require('../../config/dbConfig');
const bcrypt = require('bcryptjs');

const createUser = async (userData) => {
    const { username, password, role } = userData;
    const estate = 'active';
    const createdAt = new Date();
    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await pool.query(
        'INSERT INTO users (username, password, role, estate, created_at) VALUES ($1, $2, $3, $4, $5) RETURNING id, username, role, created_at, estate', 
        [username, hashedPassword, role, estate, createdAt]
    );
    return result.rows[0];
};

const getUsers = async () => {
    const result = await pool.query('SELECT id, username, role, created_at, estate FROM users WHERE estate <> $1', ['deleted']);
    return result.rows;
};

const getUserById = async (id) => {
    const result = await pool.query('SELECT id, username, role, created_at, estate FROM users WHERE id = $1', [id]);
    return result.rows[0];
};

const getDisabledUsers = async () => {
    const result = await pool.query("SELECT id, username, role, created_at, estate FROM users WHERE estate = $1", ['disabled']);
    return result.rows;
};

const updateUser = async (userData) => {
    const { id, username, password, role, estate } = userData;
    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await pool.query('UPDATE users SET username = $1, password = $2, role = $3, estate = $4 WHERE id = $5 RETURNING *', [username, hashedPassword, role, estate, id]);
    return result.rows[0];
};

const disabledUser = async (id) => {
    await pool.query('UPDATE users SET estate = $1 WHERE id = $2', ['disabled', id]);
};

const activeUser = async (id) => {
    await pool.query('UPDATE users SET estate = $1 WHERE id = $2', ['active', id]);
};

const patchUser = async (id, updates) => {
    const allowedUpdates = ['username', 'role', 'estate'];
    const updateKeys = Object.keys(updates).filter(key => allowedUpdates.includes(key));
    const setClause = updateKeys.map((key, index) => `${key} = $${index + 2}`).join(', ');
    const queryValues = updateKeys.map(key => updates[key]);
    queryValues.push(id); 
    const result = await pool.query(
        `UPDATE users SET ${setClause} WHERE id = $1 RETURNING id, username, role, created_at, estate`,
        [id, ...queryValues]
    );
    return result.rows.length === 0 ? null : result.rows[0];
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
