const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  host: 'localhost',
  port: 5432,
  database: 'BD_Las_Nubes',
  user: 'admin',
  password: 'admin'
});

pool.connect((err) => {
    if(err) {
        console.error('Error connecting to the database:', err.stack);
    } else {
        console.log('Database connection successful');
    }
});

module.exports = pool;