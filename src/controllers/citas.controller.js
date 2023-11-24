const citasModel = require('../models/citas.model');

const createCita = async (req,res) => {
    try {
        const citaData = req.body;
        const cita = await citasModel.createCita(citaData);
        res.status(201).json(cita);
    } catch (err) {
        res.status(500).send(err.message);
    }
}

const getCitasPaciente = async (req,res) => {
    try {
        const { id } = req.params;
        const citas = await citasModel.getCitaByState(id, 'activa');
        res.status(200).json(citas);
    } catch (err) {
        res.status(500).send(err.message);
    }
}

const cancelCita = async (req,res) => {
    try {
        const { id } = req.params;
        await citasModel.cancelCita(id);
        res.status(200).json({msg: 'Cita cancelada'});
    } catch (err) {
        res.status(500).send(err.message);
    }
}

module.exports = {
    createCita,
    getCitasPaciente,
    cancelCita
}