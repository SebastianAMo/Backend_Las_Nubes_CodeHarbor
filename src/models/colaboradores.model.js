const pool = require('../../config/dbConfig');
const bcrypt = require('bcryptjs');

const createUser = async (userData) => {
  const { username, password, role } = userData;
  const estate = 'active';
  const createdAt = new Date().toLocaleDateString('en-CA', {
    timeZone: 'America/Bogota',
  });
  const hashedPassword = await bcrypt.hash(password, 10);
  const result = await pool.query(
    'INSERT INTO users (username, password, role, estate, created_at) VALUES ($1, $2, $3, $4, $5) RETURNING id, username, role, created_at, estate',
    [username, hashedPassword, role, estate, createdAt]
  );
  return result.rows[0];
};

const getUsers = async () => {
  const result = await pool.query(
    'SELECT id, username, role, created_at, estate FROM users'
  );
  return result.rows;
};

const getUserById = async (id) => {
  const result = await pool.query(
    'SELECT id, username, role, created_at, estate FROM users WHERE id = $1',
    [id]
  );
  return result.rows[0];
};

const disabledUser = async (id) => {
  await pool.query('UPDATE users SET estate = $1 WHERE id = $2', [
    'disabled',
    id,
  ]);
};

const activeUser = async (id) => {
  await pool.query('UPDATE users SET estate = $1 WHERE id = $2', [
    'active',
    id,
  ]);
};

const updateUser = async (id, updateFields) => {
  if (updateFields.password) {
    updateFields.password = await bcrypt.hash(updateFields.password, 10);
  }
  const keys = Object.keys(updateFields);
  const values = keys.map((key) => updateFields[key]);

  const setString = keys
    .map((key, index) => `${key} = $${index + 1}`)
    .join(', ');

  const query = `UPDATE users SET ${setString} WHERE id = $${
    keys.length + 1
  } RETURNING *`;
  const result = await pool.query(query, [...values, id]);

  return result.rows[0];
};

const getInformePacientes = async () => {
  try {
    // Consulta para contar pacientes activos
    const pacientesActivos = await pool.query(
      `SELECT COUNT(*) AS total_pacientes_activos
             FROM pacientes
             WHERE is_deleted = FALSE;`
    );
    // Consulta para contar pacientes en el hospital
    const pacientesEnHospital = await pool.query(
      `SELECT COUNT(DISTINCT id_paciente) AS pacientes_en_hospital
      FROM citas_medicas
      WHERE fecha = CURRENT_DATE
        AND (estado = 'Confirmada' OR estado = 'En cita');
      `
    );
    // Consulta para contar citas en el mes actual
    const citasMesActual = await pool.query(
      `SELECT COUNT(*) AS citas_mes_actual
             FROM citas_medicas
             WHERE EXTRACT(MONTH FROM fecha) = EXTRACT(MONTH FROM CURRENT_DATE)
               AND EXTRACT(YEAR FROM fecha) = EXTRACT(YEAR FROM CURRENT_DATE) AND estado = 'Realizada';`
    );
    return {
      totalPacientesActivos: pacientesActivos.rows[0].total_pacientes_activos,
      pacientesEnHospital: pacientesEnHospital.rows[0].pacientes_en_hospital,
      citasMesActual: citasMesActual.rows[0].citas_mes_actual,
    };
  } catch (err) {
    console.error(err.message);
    throw err;
  }
};

const getInformesColaboradores = async () => {
  try {
    // Cantidad de colaboradores por jerarquia
    const colaboradoresPorJerarquia = await pool.query(
      `SELECT jerarquia, COUNT(*) AS cantidad
        FROM colaboradores
        GROUP BY jerarquia;`
    );

    // Número total de pacientes atendidos por todos los colaboradores en el mes actual
    // Suponiendo que esto se puede calcular a partir de las citas médicas
    const totalCitasMesActual = await pool.query(
      `SELECT COUNT(*) AS total_citas_realizadas
      FROM citas_medicas
      WHERE estado = 'Realizada'
        AND EXTRACT(MONTH FROM fecha) = EXTRACT(MONTH FROM CURRENT_DATE)
        AND EXTRACT(YEAR FROM fecha) = EXTRACT(YEAR FROM CURRENT_DATE);
      `
    );

    // Total de salario de todos los colaboradores
    const totalSalarios = await pool.query(
      `SELECT SUM(salario) AS total_salarios
        FROM colaboradores;`
    );

    return {
      colaboradoresPorjerarquia: colaboradoresPorJerarquia.rows,
      totalCitasMesActual: totalCitasMesActual.rows[0].pacientes_atendidos,
      totalSalarios: totalSalarios.rows[0].total_salarios,
    };
  } catch (err) {
    console.error(err.message);
    throw err;
  }
};

const getInformesMedicamentos = async () => {
  try {
    // Inventario actual de medicamentos
    const inventarioMedicamentos = await pool.query(
      `SELECT denominacion, cantidad_total, fecha_vencimiento, alto_costo
      FROM medicamentos
      WHERE fecha_vencimiento > CURRENT_DATE;`
    );

    // Uso de medicamentos de alto costo
    const usoMedicamentosAltoCosto = await pool.query(
      `SELECT denominacion, COUNT(id_medicamento) AS veces_recetado
      FROM medicamentos_recetados
      JOIN medicamentos ON medicamentos.id = medicamentos_recetados.id_medicamento
      WHERE alto_costo = TRUE
      GROUP BY denominacion;`
    );

    // Medicamentos próximos a vencer
    const medicamentosProximosVencer = await pool.query(
      `SELECT denominacion, fecha_vencimiento
      FROM medicamentos
      WHERE fecha_vencimiento BETWEEN CURRENT_DATE AND CURRENT_DATE + INTERVAL '3 months';`
    );

    // Resumen de solicitudes de medicamentos
    const resumenSolicitudesMedicamentos = await pool.query(
      `SELECT denominacion, COUNT(solicitudes.id) AS cantidad_solicitudes
      FROM medicamentos
      JOIN medicamentos_recetados ON medicamentos.id = medicamentos_recetados.id_medicamento
      JOIN solicitudes ON medicamentos_recetados.id = solicitudes.id_medicamento_recetado
      GROUP BY denominacion;`
    );

    return {
      inventarioMedicamentos: inventarioMedicamentos.rows,
      usoMedicamentosAltoCosto: usoMedicamentosAltoCosto.rows,
      medicamentosProximosVencer: medicamentosProximosVencer.rows,
      resumenSolicitudesMedicamentos: resumenSolicitudesMedicamentos.rows,
    };
  } catch (err) {
    console.error(err.message);
    throw err;
  }
};

module.exports = {
  createUser,
  getUsers,
  getUserById,
  updateUser,
  disabledUser,
  activeUser,
  getInformePacientes,
  getInformesColaboradores,
  getInformesMedicamentos,
};
