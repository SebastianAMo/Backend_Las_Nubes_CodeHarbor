const citasModel = require('../models/citas.model');

const getCitasPaciente = async (req, res) => {
  try {
    const { id } = req.params;
    const citas = await citasModel.getCitaByState(id, 'activa');
    res.status(200).json(citas);
  } catch (err) {
    res.status(500).send(err.message);
  }
};

const cancelCita = async (req, res) => {
  try {
    const { id } = req.params;
    await citasModel.cancelCita(id);
    res.status(200).json({ msg: 'Cita cancelada' });
  } catch (err) {
    res.status(500).send(err.message);
  }
};

const getCitasActivas = async (req, res) => {
  try {
    const date = new Date();
    const date1 = date.toISOString().split('T')[0];
    const time = date.toISOString().split('T')[1].split('.')[0];
    const citas = await userModel.getCitaByState(0, 0, 'activa', date1, time);
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
    const date1 = date.toISOString().split('T')[0];
    const time = date.toISOString().split('T')[1].split('.')[0];
    const citas = await userModel.getCitaByState(
      1,
      numero_identificacion,
      'activa',
      date1,
      time
    );
    res.json(citas);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error');
  }
};

const getCitasConfiColaborador = async (req, res) => {
  try {
    const { numero_identificacion } = req.params;
    const date = new Date();
    const date1 = date.toISOString().split('T')[0];
    const time = date.toISOString().split('T')[1].split('.')[0];
    const citas = await userModel.getCitaByState(
      1,
      numero_identificacion,
      'confirmada',
      date1,
      time
    );
    res.json(citas);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error');
  }
};
const updateCita = async (req, res) => {
  try {
    const id = req.params.id_cita;
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
};

module.exports = {
  getCitasPaciente,
  cancelCita,
};
