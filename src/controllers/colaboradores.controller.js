const userModel = require('../models/colaboradores.model');

const createUser = async (req, res) => {
    try {
        const userData = req.body;
        const user = await userModel.createUser(userData);
        res.status(201).json(user);
    } catch (err) {
        console.error("Error creando usuario" + err.message);
        res.status(500).send('Server error');
    }
};

const getUsers = async (req, res) => {
    try {
        const users = await userModel.getUsers();
        res.json(users);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

const getUserById = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await userModel.getUserById(id);
        res.json(user);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

const getDisabledUsers = async (req, res) => {
    try {
        const users = await userModel.getDisabledUsers();
        res.json(users);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

const updateUser = async (req, res) => {
    try {
        const userData = { id: req.params.id, ...req.body };
        const user = await userModel.updateUser(userData);
        res.json(user);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

const disabledUser = async (req, res) => {
    try {
        const { id } = req.params;
        await userModel.disabledUser(id);
        res.json({ msg: 'User state changed to disabled' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

const activeUser = async (req, res) => {
    try {
        const { id } = req.body;
        await userModel.activeUser(id);
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
        const user = await userModel.patchUser(id, updates);
        if (!user) {
            return res.status(404).send({ error: 'User not found or is disabled' });
        }
        res.json(user);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

router.get('/descargar-informe', async (req, res) => {
    try {
        const datos = await obtenerDatosParaPDF(); // Reemplaza con tu lógica para obtener datos
        const pdfBuffer = await generarPDFConDatos(datos);
  
        res.writeHead(200, {
            'Content-Length': Buffer.byteLength(pdfBuffer),
            'Content-Type': 'application/pdf',
            'Content-disposition': 'attachment;filename=informe.pdf',
        });
        res.end(pdfBuffer);
    } catch (error) {
        console.error('Error al generar el PDF:', error);
        res.status(500).send('Error interno del servidor');
    }
  });

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
