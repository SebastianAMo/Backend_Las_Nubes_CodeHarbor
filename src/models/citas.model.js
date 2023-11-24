const pool = require('../../config/dbConfig');

const createCita = async (citaData) => {

    const estado = 'activa';
    const result = await pool.query(
        `INSERT INTO citas_medicas (id_paciente, id_colaborador, fecha, hora, estado) VALUES ($1, $2, $3, $4, $5)
        RETURNING *`,
    [citaData.id_paciente, citaData.id_colaborador, citaData.fecha, citaData.hora, estado]
    );
    return result.rows[0];

}

const getCitaByState = async (numero_identificacion, state) => {
    const result = await pool.query(
        `SELECT * FROM citas_medicas 
         WHERE (id_paciente = $1 OR id_colaborador = $1) 
         AND estado = $2`,
        [numero_identificacion, state]
    );
    return result.rows;
}

const cancelCita = async (numero_identificacion) => {
    const result = await pool.query(
        `UPDATE citas_medicas SET estado = 'cancelada' WHERE id_paciente = $1 RETURNING *`,
        [numero_identificacion]
    );

    return result.rows[0];
}


module.exports = {
    createCita,
    getCitaByState,
    cancelCita
}

