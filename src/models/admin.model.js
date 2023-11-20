const pool = require('../../config/dbConfig');

const addColaborador = async (colaboradorData) => {
    const result = await pool.query(
        `INSERT INTO colaboradores 
            (tipo_identificacion, numero_identificacion, nombre, apellido, fecha_nacimiento, estado_civil, sexo, direccion, telefono, correo_electronico, salario, fecha_ingreso, jerarquia, especialidad)
        VALUES 
            ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
        RETURNING *`,
        [colaboradorData.tipo_identificacion, colaboradorData.numero_identificacion, colaboradorData.nombre, colaboradorData.apellido, colaboradorData.fecha_nacimiento, colaboradorData.estado_civil, colaboradorData.sexo, colaboradorData.direccion, colaboradorData.telefono, colaboradorData.correo_electronico, colaboradorData.salario, colaboradorData.fecha_ingreso, colaboradorData.jerarquia, colaboradorData.especialidad]
    );
    return result.rows[0];
};

const getAllColaboradores = async () => {
    const result = await pool.query('SELECT * FROM colaboradores');
    return result.rows;
};

const getColaboradorByNumId = async (numero_identificacion) => {
    const result = await pool.query('SELECT * FROM colaboradores WHERE numero_identificacion = $1', [numero_identificacion]);
    return result.rows[0];
};

const getDeletedColaboradores = async () => {
    const result = await pool.query('SELECT * FROM colaboradores WHERE is_deleted = true');
    return result.rows;
};

const updateColaborador = async (colaboradorData) => {
    const result = await pool.query(
        `UPDATE colaboradores 
        SET tipo_identificacion = $1, numero_identificacion = $2, nombre = $3, apellido = $4, fecha_nacimiento = $5, estado_civil = $6, sexo = $7, direccion = $8, telefono = $9, correo_electronico = $10, salario = $11, fecha_ingreso = $12, jerarquia = $13, especialidad = $14, usuario_id = $15, updated_at = $17 
        WHERE id = $16 AND is_deleted = FALSE
        RETURNING *`,
        [colaboradorData.tipo_identificacion, colaboradorData.numero_identificacion, colaboradorData.nombre, colaboradorData.apellido, colaboradorData.fecha_nacimiento, colaboradorData.estado_civil, colaboradorData.sexo, colaboradorData.direccion, colaboradorData.telefono, colaboradorData.correo_electronico, colaboradorData.salario, colaboradorData.fecha_ingreso, colaboradorData.jerarquia, colaboradorData.especialidad, colaboradorData.usuario_id, colaboradorData.id, colaboradorData.updateTimestamp]
    );
    return result.rows[0];
};

const deleteColaborador = async (numero_identificacion) => {
    await pool.query('UPDATE colaboradores SET is_deleted = $1, deleted_at = $2 WHERE numero_identificacion = $3', [true, new Date(), numero_identificacion]);
};

const patchColaborador = async (numero_identificacion, updateFields) => {
    const keys = Object.keys(updateFields);
    const values = keys.map(key => updateFields[key]);
    const setString = keys.map((key, index) => `${key} = $${index + 1}`).join(', ');

    const query = `UPDATE colaboradores SET ${setString} WHERE numero_identificacion = $${keys.length + 1} RETURNING *`;
    const result = await pool.query(query, [...values, numero_identificacion]);

    return result.rows[0];
};

module.exports = {
    addColaborador,
    getAllColaboradores,
    getColaboradorByNumId,
    getDeletedColaboradores,
    updateColaborador,
    deleteColaborador,
    patchColaborador,
};