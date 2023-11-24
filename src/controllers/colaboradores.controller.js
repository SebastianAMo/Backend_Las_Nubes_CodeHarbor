const userModel = require('../models/colaboradores.model');
const {generatePDF} = require('../utils/generatePDF');

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
        const { id } = req.params;
        await userModel.activeUser(id);
        res.json({ msg: 'User state changed to active' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

const updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        const updates = req.body;
        const user = await userModel.updateUser(id, updates);
        if (!user) {
            return res.status(404).send({ error: 'User not found or is disabled' });
        }
        res.json(user);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

const getInforme = async (req, res) => {
    const type = req.params.option;
    let titulo;
    try {
        let informe;
        if (type == 1){
        informe = await userModel.getInformePacientes();
        titulo = "Informe de pacientes";
        } else if (type == 2){
        informe = await userModel.getInformesColaboradores();
        console.log(informe);
        titulo = "Informe de colaboradores";
        } else if (type == 3){
        informe = await userModel.getInformesMedicamentos();
        titulo = "Informe de medicamentos";
        } else {
            return res.status(404).send({ error: 'Informe not found or is disabled' });
        }
        const pdfBuffer = await generatePDF(informe,titulo);

        res.writeHead(200, {
            'Content-Length': Buffer.byteLength(pdfBuffer),
            'Content-Type': 'application/pdf',
            'Content-disposition': 'attachment;filename=informe.pdf',
        });
        res.end(pdfBuffer);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

const getCitasActivas = async (req, res) => {
    try {
        const date = new Date();
        const date1= date.toISOString().split('T')[0];
        const time = date.toISOString().split('T')[1].split('.')[0];
        const citas = await userModel.getCitaByState(0,0,"activa",date1,time);   
        res.json(citas);
    } catch (err) {
        console.error(err);
        res.status(500).send('Error');
    }
};

const getCitasActivasColaborador = async (req, res) => {
    try {
        const { numero_identificacion } = req.params;
        const date = new Date();
        const date1= date.toISOString().split('T')[0];
        const time = date.toISOString().split('T')[1].split('.')[0];
        const citas = await userModel.getCitaByState(1,numero_identificacion,"activa",date1,time);   
        res.json(citas);
    } catch (err) {
        console.error(err);
        res.status(500).send('Error');
    }
}

const getCitasConfiColaborador = async (req, res) => {
    try {
        const { numero_identificacion } = req.params;
        const date = new Date();
        const date1= date.toISOString().split('T')[0];
        const time = date.toISOString().split('T')[1].split('.')[0];
        const citas = await userModel.getCitaByState(1,numero_identificacion,"confirmada",date1,time);   
        res.json(citas);
    } catch (err) {
        console.error(err);
        res.status(500).send('Error');
    }
}
const updateCita = async (req, res) => {
    try {
        const id  = req.params.id_cita;
        console.log(id);
        const updates = req.body;
        const cita = await userModel.updateCita(id, updates);
        if (!cita) {
            return res.status(404).send({ error: 'Cita not found or is disabled' });
        }
        res.json(cita);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
}

module.exports = {
    createUser,
    getUsers,
    getUserById,
    updateUser,
    disabledUser,
    activeUser,
    getInforme,
    getCitasActivas,
    getCitasActivasColaborador,
    getCitasConfiColaborador,
    updateCita
};
