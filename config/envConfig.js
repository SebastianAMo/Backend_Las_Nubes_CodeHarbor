require('dotenv').config();

const config = {
  port: process.env.SERVER_PORT || 3000,
  jwt_secret: process.env.JWT_SECRET,
  db: {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    database: process.env.DB_DATABASE || 'BD_Las_Nubes',
    user: process.env.DB_USER || 'test',
    password: process.env.DB_PASSWORD || 'test',
  },
};

module.exports = { config };
