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

const updatePaciente = async (pacienteData) => {
    pacienteData.updateTimestamp = new Date();
    const result = await pool.query(
        `UPDATE pacientes 
        SET tipo_identificacion = $1, numero_identificacion = $2, nombre = $3, apellido = $4, fecha_nacimiento = $5, estado_civil = $6, sexo = $7, direccion = $8, telefono = $9, correo_electronico = $10, usuario_id = $11, updated_at = $12
        WHERE id = $13
        RETURNING *`,
        [pacienteData.tipo_identificacion, pacienteData.numero_identificacion, pacienteData.nombre, pacienteData.apellido, pacienteData.fecha_nacimiento, pacienteData.estado_civil, pacienteData.sexo, pacienteData.direccion, pacienteData.telefono, pacienteData.correo_electronico, pacienteData.usuario_id, pacienteData.updateTimestamp, pacienteData.id]
    );
    return result.rows[0];
};

const deletePaciente = async (id) => {
    await pool.query('UPDATE pacientes SET is_deleted = TRUE, deleted_at = $2 WHERE id = $1', [id, new Date()]);
};

const patchPaciente = async (id, updateFields) => {
    const keys = Object.keys(updateFields);
    const values = keys.map(key => updateFields[key]);
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
    updatePaciente,
    deletePaciente,
    patchPaciente
};
