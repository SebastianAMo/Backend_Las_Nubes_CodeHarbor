const userController = require('./user.controller');
const pacienteModel = require('../models/pacientes.model');


const addPaciente = async (req, res) => {
    try {
        const pacienteData = req.body;
        const paciente = await pacienteModel.addPaciente(pacienteData);

        // Lógica para la creación de usuario asociado, si es necesario
        const userCreationResponse = await userController.createUser({
            username: pacienteData.numero_identificacion,
            password: pacienteData.numero_identificacion,
            role: 'paciente'
        });

        if (userCreationResponse) {
            await pacienteModel.updatePaciente(pacienteData.numero_identificacion, {usuario_id: userCreationResponse.id});
        }else{
            throw new Error(userCreationResponse.error);
        }

        res.status(201).json(paciente);
    } catch (err) {
        res.status(500).send(err.message);
    }
};

const getAllPacientes = async (req, res) => {
    try {
        const pacientes = await pacienteModel.getAllPacientes();
        res.json(pacientes);
    } catch (err) {
        res.status(500).send(err.message);
    }
};

const getPacienteByNumId = async (req, res) => {
    try {
        const { numero_identificacion } = req.params;
        const paciente = await pacienteModel.getPacienteByNumId(numero_identificacion);
        res.json(paciente);
    } catch (err) {
        res.status(500).send(err.message);
    }
};

const getDeletedPacientes = async (req, res) => {
    try {
        const pacientes = await pacienteModel.getDeletedPacientes();
        res.json(pacientes);
    } catch (err) {
        res.status(500).send(err.message);
    }
};

const deletePaciente = async (req, res) => {
    try {
        const { id } = req.params;
        await pacienteModel.deletePaciente(id);
        res.json({ message: 'Paciente eliminado lógicamente' });
    } catch (err) {
        res.status(500).send(err.message);
    }
};

const updatePaciente = async (req, res) => {
    try {
        const { id } = req.params;
        const updateFields = req.body;
        const paciente = await pacienteModel.patchPaciente(id, updateFields);
        res.json(paciente).status(200);
    } catch (err) {
        res.status(500).send(err.message);
    }
};

module.exports = {
    addPaciente,
    getAllPacientes,
    getPacienteByNumId,
    getDeletedPacientes,
    updatePaciente,
    deletePaciente
};
