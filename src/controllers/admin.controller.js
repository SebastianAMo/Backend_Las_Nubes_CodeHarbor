const userController = require('../models/user.model');
const adminModel = require('../models/admin.model');

const addColaborador = async (req, res) => {
  try {
      const colaboradorData = req.body;
      const colaborador = await adminModel.addColaborador(colaboradorData);

      const userCreationResponse = await userController.createUser({
          username: colaboradorData.numero_identificacion,
          password: colaboradorData.numero_identificacion,
          role: colaboradorData.jerarquia
      });
      
      if (userCreationResponse) {
          await adminModel.patchColaborador(
              colaboradorData.numero_identificacion,
              {usuario_id: userCreationResponse.id}
          );
      }else{
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
      const colaborador = await adminModel.getColaboradorByNumId(numero_identificacion);
      res.json(colaborador);
  } catch (err) {
      res.status(500).send(err.message);
  }
};

const deleteColaborador = async (req, res) => {
  try {
      const { numero_identificacion } = req.params;
      await adminModel.deleteColaborador(numero_identificacion);
      res.json({ message: 'Colaborador eliminado' });
  } catch (err) {
      res.status(500).send(err.message);
  }
};

const updateColaborador = async (req, res) => {
  try {
      const { numero_identificacion } = req.params;
      const updateFields = req.body;
      const colaborador = await adminModel.patchColaborador(numero_identificacion, updateFields);
      res.json(colaborador);
  } catch (err) {
      res.status(500).send(err.message);
  }
};

module.exports = {
  addColaborador,
  getAllColaboradores,
  getColaboradorByNumId,
  updateColaborador,
  deleteColaborador
};