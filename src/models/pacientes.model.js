const pool = require('../../config/dbConfig');

const addPaciente = async (pacienteData) => {
    const result = await pool.query(
        `INSERT INTO pacientes 
            (tipo_identificacion, numero_identificacion, nombre, apellido, fecha_nacimiento, estado_civil, sexo, direccion, telefono, correo_electronico, usuario_id)
        VALUES 
            ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
        RETURNING *`,
        [pacienteData.tipo_identificacion, pacienteData.numero_identificacion, pacienteData.nombre, pacienteData.apellido, pacienteData.fecha_nacimiento, pacienteData.estado_civil, pacienteData.sexo, pacienteData.direccion, pacienteData.telefono, pacienteData.correo_electronico, pacienteData.usuario_id]
    );
    return result.rows[0];
};

const getAllPacientes = async () => {
    const result = await pool.query('SELECT * FROM pacientes');
    return result.rows;
};

const getPacienteByNumId = async (numero_identificacion) => {
    const result = await pool.query('SELECT * FROM pacientes WHERE numero_identificacion = $1', [numero_identificacion]);
    return result.rows[0];
};

const getDeletedPacientes = async () => {
    const result = await pool.query('SELECT * FROM pacientes WHERE is_deleted = TRUE');
    return result.rows;
};

const deletePaciente = async (id) => {
    await pool.query('UPDATE pacientes SET is_deleted = TRUE, deleted_at = $2 WHERE id = $1', [id, new Date()]);
};

const updatePaciente = async (id, updateFields) => {
    const keys = Object.keys(updateFields);
    const values = keys.map(key => updateFields[key]);
    const updateTimestamp = new Date();
    keys.push('updated_at');
    values.push(updateTimestamp);
    const setString = keys.map((key, index) => `${key} = $${index + 1}`).join(', ');
    const query = `UPDATE pacientes SET ${setString} WHERE id = $${keys.length + 1} RETURNING *`;
    const result = await pool.query(query, [...values, id]);
    return result.rows[0];
};

module.exports = {
    addPaciente,
    getAllPacientes,
    getPacienteByNumId,
    getDeletedPacientes,
    deletePaciente,
    updatePaciente
};
