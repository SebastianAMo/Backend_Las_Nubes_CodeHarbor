const { createUser } = require('../models/colaboradores.model');
const pacienteModel = require('../models/pacientes.model');
const { updateOneFile } = require('../utils/updateFiles');

const addPaciente = async (req, res) => {
  try {
    const pacienteData = req.body;
    const paciente = await pacienteModel.addPaciente(pacienteData);

    const userCreationResponse = await createUser({
      username: pacienteData.numero_identificacion,
      password: pacienteData.numero_identificacion,
      role: 'paciente',
    });

    if (userCreationResponse) {
      await pacienteModel.updatePaciente(pacienteData.numero_identificacion, {
        usuario_id: userCreationResponse.id,
      });
    } else {
      throw new Error(userCreationResponse.error);
    }

    await pacienteModel.asignarColaboradorAPaciente(
      pacienteData.numero_identificacion
    );

    res.status(201).json(paciente);
  } catch (err) {
    if (err.code === '23505') {
      // Error de violación de restricción de unicidad
      if (err.detail.includes('numero_identificacion')) {
        return res
          .status(400)
          .send('Ya existe un paciente con ese número de identificación.');
      }
      if (err.detail.includes('correo_electronico')) {
        return res
          .status(400)
          .send('Ya existe un paciente con ese correo electrónico.');
      }
    }
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
    const paciente = await pacienteModel.getPacienteByNumId(
      numero_identificacion
    );
    if (!paciente) {
      return res.status(404).send('No existe un paciente con ese número de identificación.');
    }
    res.json(paciente);
  } catch (err) {
    res.status(500).send(err.message);
  }
};

const deletePaciente = async (req, res) => {
  try {
    const id = req.params.numero_identificacion;
    const paciente = await pacienteModel.getPacienteByNumId(id);
    if (!paciente) {
      return res.status(404).send('No existe un paciente con ese número de identificación.');
    }
    await pacienteModel.quitarColaboradorDePacienteEliminado(id);
    await pacienteModel.deletePaciente(id);
    res.json({ message: 'Paciente eliminado lógicamente' });
  } catch (err) {
    res.status(500).send(err.message);
  }
};

const updatePaciente = async (req, res) => {
  const { numero_identificacion } = req.params;
  const updateFields = req.body;
  try {
    const infPaciente = await pacienteModel.getPacienteByNumId(
      numero_identificacion
    );
    if (!infPaciente) {
      return res.status(404).send('No existe un paciente con ese número de identificación.');
    }
    const updatePhoto = await updateOneFile(req.file, 'foto_url', infPaciente);

    Object.assign(updateFields, updatePhoto);

    const paciente = await pacienteModel.updatePaciente(
      numero_identificacion,
      updateFields
    );

    if (!updateFields.is_deleted) {
      await pacienteModel.asignarColaboradorAPaciente(numero_identificacion);
    }
    res.json(paciente).status(200);
  } catch (err) {
    res.status(500).send(err.message);
  }
};

module.exports = {
  addPaciente,
  getAllPacientes,
  getPacienteByNumId,
  updatePaciente,
  deletePaciente,
};