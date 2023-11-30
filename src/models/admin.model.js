const pool = require('../../config/dbConfig');

const addColaborador = async (colaboradorData) => {
  const result = await pool.query(
    `INSERT INTO colaboradores 
            (tipo_identificacion, numero_identificacion, nombre, apellido, fecha_nacimiento, estado_civil, sexo, direccion, telefono, correo_electronico, salario, fecha_ingreso, jerarquia, especialidad)
        VALUES 
            ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
        RETURNING *`,
    [
      colaboradorData.tipo_identificacion,
      colaboradorData.numero_identificacion,
      colaboradorData.nombre,
      colaboradorData.apellido,
      colaboradorData.fecha_nacimiento,
      colaboradorData.estado_civil,
      colaboradorData.sexo,
      colaboradorData.direccion,
      colaboradorData.telefono,
      colaboradorData.correo_electronico,
      colaboradorData.salario,
      colaboradorData.fecha_ingreso,
      colaboradorData.jerarquia,
      colaboradorData.especialidad,
    ]
  );
  return result.rows[0];
};

const getAllColaboradores = async () => {
  const result = await pool.query('SELECT * FROM colaboradores');
  return result.rows;
};

const getColaboradorByNumId = async (numero_identificacion) => {
  const result = await pool.query(
    'SELECT * FROM colaboradores WHERE numero_identificacion = $1',
    [numero_identificacion]
  );
  return result.rows[0];
};

const deleteColaborador = async (numero_identificacion) => {
  await pool.query(
    'UPDATE colaboradores SET is_deleted = $1, deleted_at = $2 WHERE numero_identificacion = $3',
    [true, new Date().toLocaleDateString('en-CA', { timeZone: 'America/Bogota' }), numero_identificacion]
  );
};

const updateColaborador = async (numero_identificacion, updateFields) => {
  const keys = Object.keys(updateFields);
  const values = keys.map((key) => updateFields[key]);
  const updateTimestamp = new Date().toLocaleDateString('en-CA', { timeZone: 'America/Bogota' });
  keys.push('updated_at');
  values.push(updateTimestamp);

  const setString = keys
    .map((key, index) => `${key} = $${index + 1}`)
    .join(', ');

  const query = `UPDATE colaboradores SET ${setString} WHERE numero_identificacion = $${
    keys.length + 1
  } RETURNING *`;
  const result = await pool.query(query, [...values, numero_identificacion]);

  return result.rows[0];
};

module.exports = {
  addColaborador,
  getAllColaboradores,
  getColaboradorByNumId,
  updateColaborador,
  deleteColaborador,
};
