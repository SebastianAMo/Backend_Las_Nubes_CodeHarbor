const colaboradoresModel = require('../models/colaboradores.model');
const adminModel = require('../models/admin.model');
const pacientesModel = require('../models/pacientes.model');
const { updateOneFile } = require('../utils/updateFiles');

const addColaborador = async (req, res) => {
  try {
    const colaboradorData = req.body;
    const colaborador = await adminModel.addColaborador(colaboradorData);

    const userCreationResponse = await colaboradoresModel.createUser({
      username: colaboradorData.numero_identificacion,
      password: colaboradorData.numero_identificacion,
      role: colaboradorData.jerarquia,
    });

    if (userCreationResponse) {
      await adminModel.updateColaborador(
        colaboradorData.numero_identificacion,
        { usuario_id: userCreationResponse.id }
      );
    } else {
      throw new Error(userCreationResponse.error);
    }

    res.status(201).json(colaborador);
  } catch (err) {
    res.status(500).send(err.message);
  }
};

const getAllColaboradores = async (req, res) => {
  try {
    const colaboradores = await adminModel.getAllColaboradores();
    res.json(colaboradores);
  } catch (err) {
    res.status(500).send(err.message);
  }
};

const getColaboradorByNumId = async (req, res) => {
  try {
    const { numero_identificacion } = req.params;
    const colaborador = await adminModel.getColaboradorByNumId(
      numero_identificacion
    );
    if (colaborador.foto_url) {
      colaborador.foto_url = `${req.protocol}://${req.get('host')}/${
        colaborador.foto_url
      }`;
    }
    res.json(colaborador);
  } catch (err) {
    res.status(500).send(err.message);
  }
};

const deleteColaborador = async (req, res) => {
  try {
    const { numero_identificacion } = req.params;
    await adminModel.deleteColaborador(numero_identificacion);
    await pacientesModel.quitarColaboradorDePacientesEliminado(
      numero_identificacion
    );
    res.json({ message: 'Colaborador eliminado' });
  } catch (err) {
    res.status(500).send(err.message);
  }
};

const updateColaborador = async (req, res) => {
  const { numero_identificacion } = req.params;
  const updateFields = req.body;

  try {
    const infoColaborador = await adminModel.getColaboradorByNumId(
      numero_identificacion
    );
    const updatePhoto = await updateOneFile(
      req.file,
      'foto_url',
      infoColaborador
    );

    Object.assign(updateFields, updatePhoto);

    // Update user role if necessary
    if (updateFields.jerarquia) {
      const userUpdateResponse = await colaboradoresModel.updateUser(
        infoColaborador.usuario_id,
        { role: updateFields.jerarquia }
      );
      if (!userUpdateResponse) {
        throw new Error(userUpdateResponse.error);
      }
    }
    const colaborador = await adminModel.updateColaborador(
      numero_identificacion,
      updateFields
    );

    res.json(colaborador);
  } catch (err) {
    console.log('Error en updateColaborador:', err);
    res.status(500).send(err.message);
  }
};

module.exports = {
  addColaborador,
  getAllColaboradores,
  getColaboradorByNumId,
  updateColaborador,
  deleteColaborador,
};
