const medicamentosRecetadosModel = require('../models/medicamentosRecetados.model');

const createMedicamentoRecetado = async (req, res) => {
    try {
        const newMedicamento = await medicamentosRecetadosModel.addMedicamentoRecetado(req.body);
        res.status(201).json(newMedicamento);
    } catch (error) {
        res.status(500).send(error.message);
    }
};

const rejectMedicamentoRecetado = async (req, res) => {
    try {
        const { id } = req.params;
        const motivoRechazo = req.body.motivo;
        await medicamentosRecetadosModel.rechazarMedicamento(id, motivoRechazo);
        res.status(200).json({ message: 'Medicamento rechazado' });
    } catch (error) {
        res.status(500).send(error.message);
    }
};

module.exports = {
    createMedicamentoRecetado,
    rejectMedicamentoRecetado
};
