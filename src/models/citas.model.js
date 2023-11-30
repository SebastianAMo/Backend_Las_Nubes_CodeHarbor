const pool = require('../../config/dbConfig');

const getCitasSinAsignar = async () => {
  const currentDate = new Date().toLocaleDateString('en-CA', { timeZone: 'America/Bogota' });
  

  const query = `
        SELECT cm.id_cita, cm.fecha, cm.hora, c.nombre, c.apellido, c.especialidad
        FROM citas_medicas cm
        JOIN colaboradores c ON cm.id_medico = c.numero_identificacion
        WHERE cm.estado = 'Sin asignar' 
              AND c.jerarquia = 'Médico' 
              AND cm.fecha > $1;
    `;

  const result = await pool.query(query, [currentDate]);
  return result.rows;
};

const getCitaById = async (id_cita) => {
  const result = await pool.query(
    `SELECT cm.*, 
            p.nombre AS nombre_paciente, p.apellido AS apellido_paciente, p.correo_electronico, p.telefono, p.tipo_identificacion,
            c.nombre AS nombre_medico, c.apellido AS apellido_medico, c.especialidad
     FROM citas_medicas cm
     LEFT JOIN pacientes p ON cm.id_paciente = p.numero_identificacion
     JOIN colaboradores c ON cm.id_medico = c.numero_identificacion
     WHERE cm.id_cita = $1`,
    [id_cita]
  );
  return result.rows[0];
};

const getCitasPacienteActivas = async (numero_identificacion) => {
  const result = await pool.query(
    `SELECT cm.*, 
              p.nombre AS nombre_paciente, p.apellido AS apellido_paciente, p.correo_electronico, p.telefono, p.tipo_identificacion,
              c.nombre AS nombre_medico, c.apellido AS apellido_medico, c.especialidad
       FROM citas_medicas cm
       JOIN pacientes p ON cm.id_paciente = p.numero_identificacion
       JOIN colaboradores c ON cm.id_medico = c.numero_identificacion
       WHERE cm.id_paciente = $1 AND cm.estado = 'Activa'`,
    [numero_identificacion]
  );
  return result.rows;
};

const getCitasByState = async (numero_identificacion, state) => {
  const currentDate = new Date().toLocaleDateString('en-CA', { timeZone: 'America/Bogota' });
  const result = await pool.query(
    `SELECT cm.*, 
              p.nombre AS nombre_paciente, p.apellido AS apellido_paciente, p.correo_electronico, p.telefono, p.tipo_identificacion,
              c.nombre AS nombre_medico, c.apellido AS apellido_medico, c.especialidad
       FROM citas_medicas cm
       LEFT JOIN pacientes p ON cm.id_paciente = p.numero_identificacion
       LEFT JOIN colaboradores c ON cm.id_medico = c.numero_identificacion
       WHERE (cm.id_paciente = $1 OR cm.id_medico = $1) AND cm.estado = $2 AND cm.fecha = $3`,
    [numero_identificacion, state, currentDate]
  );
  return result.rows;
};

// Consulta las citas del dia de un enfermero en especifico con información del medicos y paciente
const getCitasEnfermero = async (numero_identificacion) => { 
  const currentDate = new Date().toLocaleDateString('en-CA', { timeZone: 'America/Bogota' });
  const result = await pool.query(
    `SELECT cm.*, 
              p.nombre AS nombre_paciente, p.apellido AS apellido_paciente, p.correo_electronico, p.telefono, p.tipo_identificacion,
              c.nombre AS nombre_medico, c.apellido AS apellido_medico, c.especialidad
       FROM citas_medicas cm
       LEFT JOIN pacientes p ON cm.id_paciente = p.numero_identificacion
       LEFT JOIN colaboradores c ON cm.id_medico = c.numero_identificacion
       WHERE cm.id_enfermero = $1 AND cm.fecha = $2`,
    [numero_identificacion, currentDate]
  );
  return result.rows;
}

// Cancela una cita médica
const cancelCita = async (numero_identificacion) => {
  const result = await pool.query(
    `UPDATE citas_medicas SET estado = 'cancelada' WHERE id_paciente = $1 RETURNING *`,
    [numero_identificacion]
  );
  return result.rows[0];
};

// Get citas with state 'Activa' and date = today
const getCitasActivas = async () => {
  const currentDate = new Date().toLocaleDateString('en-CA', { timeZone: 'America/Bogota' });

  const result = await pool.query(
    `SELECT cm.*, 
              p.nombre AS nombre_paciente, p.apellido AS apellido_paciente, p.correo_electronico, p.telefono, p.tipo_identificacion,
              c.nombre AS nombre_medico, c.apellido AS apellido_medico, c.especialidad
       FROM citas_medicas cm
       LEFT JOIN pacientes p ON cm.id_paciente = p.numero_identificacion
       LEFT JOIN colaboradores c ON cm.id_medico = c.numero_identificacion
       WHERE cm.fecha = $1 AND cm.estado = 'Activa'` ,
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
  getCitasEnfermero,
  cancelCita,
  getCitasActivas,
  updateCita,
};
