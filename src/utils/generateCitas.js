const pool = require('../../config/dbConfig');

// Función para obtener los números de identificación de todos los médicos
const getMedicos = async () => {
  const result = await pool.query(
    "SELECT numero_identificacion FROM colaboradores WHERE jerarquia = 'Médico' and is_deleted = false"
  );
  return result.rows.map((row) => row.numero_identificacion);
};

// Función para obtener la última fecha de cita programada para un médico
const getLastCita = async (numero_identificacion) => {
  const result = await pool.query(
    `SELECT id_colaborador, MAX(fecha) as ultima_fecha_cita
                                     FROM citas_medicas WHERE id_colaborador = $1 GROUP BY id_colaborador;`,
    [numero_identificacion]
  );

  if (result.rows.length > 0) {
    return result.rows[0].ultima_fecha_cita;
  } else {
    let currentDate = new Date();
    currentDate.setDate(currentDate.getDate() + 1);
    return currentDate.toISOString().split('T')[0]; // Retorna la fecha en formato 'YYYY-MM-DD'
  }
};

// Función para crear una nueva cita
const createCita = async (citaData) => {
  const estado = 'sin asignar';
  const result = await pool.query(
    `INSERT INTO citas_medicas (id_colaborador, fecha, hora, estado) 
         VALUES ($1, $2, $3, $4) RETURNING *`,
    [citaData.id_colaborador, citaData.fecha, citaData.hora, estado]
  );
  return result.rows[0];
};

const addDaysSkippingWeekends = (startDate, daysToAdd) => {
  let currentDate = new Date(startDate);
  while (daysToAdd > 0) {
    currentDate.setDate(currentDate.getDate() + 1);
    if (currentDate.getDay() !== 0) {
      // 0 es Domingo
      daysToAdd--;
    }
  }
  return currentDate;
};

const generarHorarios = () => {
  const horarios = [];
  // Definir los bloques de tiempo
  const bloques = [
    { inicio: 8, fin: 12 }, // 8:00 AM a 12:00 PM
    { inicio: 14, fin: 18 }, // 2:00 PM a 6:00 PM
  ];

  bloques.forEach((bloque) => {
    for (let hora = bloque.inicio; hora < bloque.fin; hora++) {
      // Formatear la hora para PostgreSQL
      const horaEnPunto = hora.toString().padStart(2, '0') + ':00:00';
      const mediaHora = hora.toString().padStart(2, '0') + ':30:00';
      horarios.push(horaEnPunto, mediaHora);
    }
  });

  return horarios;
};

const agregarCitasSiEsNecesario = async () => {
  const medicos = await getMedicos();

  for (const numero_identificacion of medicos) {
    let ultimaFechaCita = await getLastCita(numero_identificacion);
    let fechaUltimaCita = new Date(ultimaFechaCita);
    let fechaCita = new Date();

    // Asegurarse de que la fecha de cita empiece al menos desde el día siguiente
    if (fechaUltimaCita < fechaCita) {
      fechaUltimaCita = addDaysSkippingWeekends(fechaCita, 1);
    }

    let diasProgramados = 0;

    // Contar cuántos días hábiles hay programados desde hoy hasta la última fecha de cita
    while (diasProgramados < 10 && fechaCita <= fechaUltimaCita) {
      if (fechaCita.getDay() !== 0) {
        // 0 es Domingo
        diasProgramados++;
      }
      fechaCita = addDaysSkippingWeekends(fechaCita, 1);
    }

    let diasFaltantes = 10 - diasProgramados;

    // Generar citas solo para los días hábiles faltantes
    while (diasFaltantes > 0) {
      const horarios = generarHorarios();
      for (const hora of horarios) {
        await createCita({
          id_colaborador: numero_identificacion,
          fecha: fechaCita.toISOString().split('T')[0],
          hora: hora,
        });
      }

      fechaCita = addDaysSkippingWeekends(fechaCita, 1); // Agrega un día hábil, saltando domingos
      diasFaltantes--;
    }
  }
};

// Function to change state of citas where colaborador with jerarquia Médico is deleted to 'cancelada'
const deleteCitas = async () => {
  const result = await pool.query(
    `UPDATE citas_medicas SET estado = 'cancelada' WHERE id_colaborador IN (SELECT numero_identificacion FROM colaboradores WHERE jerarquia = 'Médico' AND is_deleted = true) RETURNING *`
  );
  return result.rows;
};

module.exports = {
  agregarCitasSiEsNecesario,
  deleteCitas,
};