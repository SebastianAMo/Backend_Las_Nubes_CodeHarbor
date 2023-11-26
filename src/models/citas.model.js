const pool = require('../../config/dbConfig');

const getCitasSinAsignar = async () => {
  const currentDate = new Date().toISOString().split('T')[0]; // Formato 'YYYY-MM-DD'

  const query = `
        SELECT cm.id_cita, cm.fecha, cm.hora, c.nombre, c.apellido, c.especialidad
        FROM citas_medicas cm
        JOIN colaboradores c ON cm.id_colaborador = c.numero_identificacion
        WHERE cm.estado = 'sin asignar' 
              AND c.jerarquia = 'Médico' 
              AND cm.fecha > $1;
    `;

  const result = await pool.query(query, [currentDate]);
  return result.rows;
};

const getCitaById = async (id_cita) => {
  const result = await pool.query(
    `SELECT * FROM citas_medicas WHERE id_cita = $1`,
    [id_cita]
  );
  return result.rows[0];
};

const getCitasPacienteActivas = async (numero_identificacion) => {
  const result = await pool.query(
    `SELECT * FROM citas_medicas WHERE id_paciente = $1 AND estado = 'activa'`,
    [numero_identificacion]
  );
  return result.rows;
};

const getCitasByState = async (numero_identificacion, state) => {
  const currentDate = new Date().toISOString().split('T')[0];
  const result = await pool.query(
    `SELECT * FROM citas_medicas 
         WHERE (id_paciente = $1 OR id_colaborador = $1) AND estado = $2 and fecha = $3`,
    [numero_identificacion, state, currentDate]
  );
  return result.rows;
};

// Cancela una cita médica
const cancelCita = async (numero_identificacion) => {
  const result = await pool.query(
    `UPDATE citas_medicas SET estado = 'cancelada' WHERE id_paciente = $1 RETURNING *`,
    [numero_identificacion]
  );
  return result.rows[0];
};

// Get citas with state 'activa' and date = today
const getCitasActivas = async () => {
  const currentDate = new Date().toISOString().split('T')[0];
  const result = await pool.query(
    `SELECT * FROM citas_medicas WHERE estado = 'activa' AND fecha = $1`,
    [currentDate]
  );
  return result.rows;
};

// Actualiza los campos de una cita médica existente
const updateCita = async (id_cita, updateFields) => {
  const keys = Object.keys(updateFields);
  const values = keys.map((key) => updateFields[key]);
  const setString = keys
    .map((key, index) => `${key} = $${index + 1}`)
    .join(', ');
  const query = `UPDATE citas_medicas SET ${setString} WHERE id_cita = $${
    keys.length + 1
  } RETURNING *`;
  const result = await pool.query(query, [...values, id_cita]);
  return result.rows[0];
};

module.exports = {
  getCitasSinAsignar,
  getCitasPacienteActivas,
  getCitasByState,
  getCitaById,
  cancelCita,
  getCitasActivas,
  updateCita,
};
