const pool = require('../../config/dbConfig');
const addMedicamentoRecetado = async (medicamentoData) => {
    const { id_formula_medica, id_medicamento, cantidad, prescripcion } = medicamentoData;
    const result = await pool.query(
        'INSERT INTO medicamentos_recetados (id_formula_medica, id_medicamento, cantidad, prescripcion) VALUES ($1, $2, $3, $4) RETURNING *',
        [id_formula_medica, id_medicamento, cantidad, prescripcion]
    );
    return result.rows[0];
};

const rechazarMedicamento = async (idMedicamentoRecetado, motivoRechazo) => {
    const result = await pool.query(
        'UPDATE medicamentos_recetados SET estado = $1, motivo_rechazo = $2 WHERE id = $3 RETURNING *',
        ['rechazado', motivoRechazo, idMedicamentoRecetado]
    );
    return result.rows[0];
};

module.exports = {
    addMedicamentoRecetado,
    rechazarMedicamento
};
