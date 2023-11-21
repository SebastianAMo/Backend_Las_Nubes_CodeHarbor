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
    const result = await pool.query('SELECT id, username, role, created_at, estate FROM users');
    return result.rows;
};

const getUserById = async (id) => {
    const result = await pool.query('SELECT id, username, role, created_at, estate FROM users WHERE id = $1', [id]);
    return result.rows[0];
};

const disabledUser = async (id) => {
    await pool.query('UPDATE users SET estate = $1 WHERE id = $2', ['disabled', id]);
};

const activeUser = async (id) => {
    await pool.query('UPDATE users SET estate = $1 WHERE id = $2', ['active', id]);
};

const updateUser = async (id, updateFields) => {
    if (updateFields.password) {
     updateFields.password = await bcrypt.hash(updateFields.password, 10);
    }
    const keys = Object.keys(updateFields);
    const values = keys.map(key => updateFields[key]);

    const setString = keys.map((key, index) => `${key} = $${index + 1}`).join(', ');

    const query = `UPDATE users SET ${setString} WHERE id = $${keys.length + 1} RETURNING *`;
    const result = await pool.query(query, [...values, id]);

    return result.rows[0];
};

module.exports = {
    createUser,
    getUsers,
    getUserById,
    updateUser,
    disabledUser,
    activeUser
};
