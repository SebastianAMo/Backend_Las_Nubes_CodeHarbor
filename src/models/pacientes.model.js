const pool = require('../../config/dbConfig');

const addPaciente = async (pacienteData) => {
  const result = await pool.query(
    `INSERT INTO pacientes 
            (tipo_identificacion, numero_identificacion, nombre, apellido, fecha_nacimiento, estado_civil, sexo, direccion, telefono, correo_electronico, usuario_id)
        VALUES 
            ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
        RETURNING *`,
    [
      pacienteData.tipo_identificacion,
      pacienteData.numero_identificacion,
      pacienteData.nombre,
      pacienteData.apellido,
      pacienteData.fecha_nacimiento,
      pacienteData.estado_civil,
      pacienteData.sexo,
      pacienteData.direccion,
      pacienteData.telefono,
      pacienteData.correo_electronico,
      pacienteData.usuario_id,
    ]
  );
  return result.rows[0];
};

const getAllPacientes = async () => {
  const result = await pool.query('SELECT * FROM pacientes');
  return result.rows;
};

const getPacienteByNumId = async (numero_identificacion) => {
  const result = await pool.query(
    'SELECT * FROM pacientes WHERE numero_identificacion = $1',
    [numero_identificacion]
  );
  return result.rows[0];
};

const deletePaciente = async (id) => {
  await pool.query(
    'UPDATE pacientes SET is_deleted = TRUE, deleted_at = $2 WHERE id = $1',
    [id, new Date()]
  );
};

const updatePaciente = async (numero_identificacion, updateFields) => {
  const keys = Object.keys(updateFields);
  const values = keys.map((key) => updateFields[key]);
  const updateTimestamp = new Date();
  keys.push('updated_at');
  values.push(updateTimestamp);
  const setString = keys
    .map((key, index) => `${key} = $${index + 1}`)
    .join(', ');
  const query = `UPDATE pacientes SET ${setString} WHERE numero_identificacion = $${
    keys.length + 1
  } RETURNING *`;
  const result = await pool.query(query, [...values, numero_identificacion]);
  return result.rows[0];
};

const asignarColaboradorAPaciente = async (numeroIdentificacionPaciente) => {
  const colaborador = await pool.query(
    `SELECT c.numero_identificacion, COUNT(p.id) as num_pacientes
       FROM colaboradores c
       LEFT JOIN pacientes p ON c.numero_identificacion = p.colaborador_encargado
       WHERE c.jerarquia = 'Médico' AND c.especialidad = 'Medicina general' AND c.is_deleted = false
       GROUP BY c.numero_identificacion
       ORDER BY num_pacientes ASC, RANDOM()
       LIMIT 1`
  );

  if (colaborador.rows.length === 0) {
    throw new Error('No hay colaboradores disponibles para asignar');
  }

  const numeroIdentificacionColaborador =
    colaborador.rows[0].numero_identificacion;

  const result = await updatePaciente(numeroIdentificacionPaciente, {
    colaborador_encargado: numeroIdentificacionColaborador,
  });

  return result.rows[0];
};

const reasignarPacientesDeColaborador = async (
  numeroIdentificacionColaborador
) => {
  const pacientes = await pool.query(
    `SELECT p.numero_identificacion
       FROM pacientes p
       WHERE p.colaborador_encargado = $1`,
    [numeroIdentificacionColaborador]
  );

  if (pacientes.rows.length === 0) {
    throw new Error('No hay pacientes asignados a este colaborador');
  }

  for (const paciente of pacientes.rows) {
    await asignarColaboradorAPaciente(paciente.numero_identificacion);
  }

  return true;
};

const quitarColaboradorDePacienteEliminado = async (
  numeroIdentificacionPaciente
) => {
  await pool.query(
    `UPDATE pacientes SET colaborador_encargado = NULL WHERE numero_identificacion = $1`,
    [numeroIdentificacionPaciente]
  );
};

module.exports = {
  addPaciente,
  getAllPacientes,
  getPacienteByNumId,
  deletePaciente,
  updatePaciente,
  asignarColaboradorAPaciente,
  reasignarPacientesDeColaborador,
  quitarColaboradorDePacienteEliminado,
};
