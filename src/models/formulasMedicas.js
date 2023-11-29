const pool = require('../../config/dbConfig');

const addFormulaMedica = async (formulaData) => {
    const { id_paciente, id_colaborador, fecha_generacion, fecha_vencimiento } = formulaData;
    const result = await pool.query(
        'INSERT INTO formulas_medicas (id_paciente, id_colaborador, fecha_generacion, fecha_vencimiento) VALUES ($1, $2, $3, $4) RETURNING *',
        [id_paciente, id_colaborador, fecha_generacion, fecha_vencimiento]
    );
    return result.rows[0];
};

const getFormulasMedicasByPaciente = async (idPaciente) => {
    const result = await pool.query(
        'SELECT * FROM formulas_medicas WHERE id_paciente = $1',
        [idPaciente]
    );
    return result.rows;
};

module.exports = {
    addFormulaMedica,
    getFormulasMedicasByPaciente,
};
