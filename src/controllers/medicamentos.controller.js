// controllers/medicamentos.controller.js (Continuación)
const medicamentoModel = require('../models/medicamentos.model');

const createMedicamento = async (req, res) => {
  try {
    const medicamento = await medicamentoModel.createMedicamento(req.body);
    res.status(201).json(medicamento);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

const getMedicamentos = async (req, res) => {
  try {
    const filters = {
      id: req.query.id,
      precio: req.query.precio,
      grupo: req.query.grupo,
      subgrupo: req.query.subgrupo,
    };
    const medicamentos = await medicamentoModel.getMedicamentos(filters);
    res.json(medicamentos);
  } catch (error) {
    res.status(500).send(error.message);
  }
};
const updateMedicamento = async (req, res) => {
  try {
    const { id } = req.params;
    const medicamento = await medicamentoModel.updateMedicamento(id, req.body);
    if (!medicamento) {
      return res.status(404).send('Medicamento no encontrado');
    }
    res.json(medicamento);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

const deleteMedicamento = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await medicamentoModel.deleteMedicamento(id);
    if (!deleted) {
      return res.status(404).send('Medicamento no encontrado');
    }
    res.send('Medicamento eliminado con éxito');
  } catch (error) {
    res.status(500).send(error.message);
  }
};

const getMedicamentosProximosAVencer = async (req, res) => {
  try {
    const medicamentos =
      await medicamentoModel.getMedicamentosProximosAVencer();
    res.json(medicamentos);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

module.exports = {
  // ...otros métodos exportados
  updateMedicamento,
  deleteMedicamento,
  getMedicamentosProximosAVencer,
  createMedicamento,
  getMedicamentos,
};
