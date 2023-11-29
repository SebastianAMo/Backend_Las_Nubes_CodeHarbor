const formulasMedicasModel = require('../models/formulasMedicas.model');

const createFormulaMedica = async (req, res) => {
    try {
        const newFormula = await formulasMedicasModel.addFormulaMedica(req.body);
        res.status(201).json(newFormula);
    } catch (error) {
        res.status(500).send(error.message);
    }
};

const getFormulasMedicasByPaciente = async (req, res) => {
    try {
        const idPaciente = req.params.id; // Obteniendo el ID del paciente de la URL
        const formulas = await formulasMedicasModel.getFormulasMedicasByPaciente(idPaciente);
        res.json(formulas);
    } catch (error) {
        res.status(500).send(error.message);
    }
};

module.exports = {
    createFormulaMedica,
    getFormulasMedicasByPaciente,
};
