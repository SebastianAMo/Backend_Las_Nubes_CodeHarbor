// middleware/authMiddleware.js
const jwt = require('jsonwebtoken');
const { getUserById } = require('../models/user');

const authMiddleware = async (req, res, next) => {
    try {
        const token = req.headers.authorization.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await getUserById(decoded.userId);

        if (user.role !== 'regente de farmacia') {
            throw new Error('No autorizado');
        }

        req.user = user;
        next();
    } catch (error) {
        res.status(401).send({ error: 'Por favor autentíquese correctamente' });
    }
};

module.exports = authMiddleware;
