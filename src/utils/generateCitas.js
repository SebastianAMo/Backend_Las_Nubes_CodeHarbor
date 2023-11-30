const { query } = require('express');
const pool = require('../../config/dbConfig');

// Función para obtener los números de identificación de todos los médicos
const getMedicos = async () => {
  const result = await pool.query(
    "SELECT numero_identificacion FROM colaboradores WHERE jerarquia = 'Médico' and is_deleted = false"
  );
  return result.rows.map((row) => row.numero_identificacion);
};

// Función para obtener los número de identificación de los enfermeros
const getEnfermeros = async () => {
  const result = await pool.query(
    "SELECT numero_identificacion FROM colaboradores WHERE jerarquia = 'Enfermero' and is_deleted = false"
  );
  return result.rows.map((row) => row.numero_identificacion);
};


// Función para obtener la última fecha de cita programada para un médico
const getLastCita = async (numero_identificacion) => {
  const result = await pool.query(
    `SELECT id_medico, MAX(fecha) as ultima_fecha_cita
                                     FROM citas_medicas WHERE id_medico = $1 GROUP BY id_medico;`,
    [numero_identificacion]
  );

  if (result.rows.length > 0) {
    return result.rows[0].ultima_fecha_cita;
  } else {
    let currentDate = new Date().toLocaleDateString('en-CA', { timeZone: 'America/Bogota' });
    currentDate.setDate(currentDate.getDate() + 1);
    return currentDate.toISOString().split('T')[0]; // Retorna la fecha en formato 'YYYY-MM-DD'
  }
};

// Función para crear una nueva cita
const createCita = async (citaData) => {
  const estado = 'Sin asignar';
  const result = await pool.query(
    `INSERT INTO citas_medicas (id_medico, id_enfermero, fecha, hora, estado) 
         VALUES ($1, $2, $3, $4, $5) RETURNING *`,
    [citaData.id_medico, citaData.id_enfermero, citaData.fecha, citaData.hora, estado]
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

const isEnfermeraAvailable = async (idEnfermera, fecha, hora) => {
  const result = await pool.query(
    `SELECT COUNT(*) FROM citas_medicas 
     WHERE id_enfermero = $1 AND fecha = $2 AND hora = $3`,
    [idEnfermera, fecha, hora]
  );

  return result.rows[0].count === '0'; // Retorna true si no hay citas asignadas
};

const asignarEnfermeraACita = async (fecha, hora, enfermeros) => {
  for (const idEnfermera of enfermeros) {
    if (await isEnfermeraAvailable(idEnfermera, fecha, hora)) {
      return idEnfermera;
    }
  }
  return null;
};

const programarCitasParaMedico = async (numero_identificacion, enfermeros) => {
  let ultimaFechaCita = await getLastCita(numero_identificacion);
  let fechaCita = new Date(ultimaFechaCita < new Date().toLocaleDateString('en-CA', { timeZone: 'America/Bogota' }) ? addDaysSkippingWeekends(new Date().toLocaleDateString('en-CA', { timeZone: 'America/Bogota' }), 1) : ultimaFechaCita);
  let diasFaltantes = 10;

  while (diasFaltantes > 0) {
    if (fechaCita.getDay() !== 0) { // 0 es Domingo
      const horarios = generarHorarios();
      for (const hora of horarios) {
        const idEnfermeroAsignado = await asignarEnfermeraACita(fechaCita.toISOString().split('T')[0], hora, enfermeros);
        await createCita({
          id_medico: numero_identificacion,
          id_enfermero: idEnfermeroAsignado,
          fecha: fechaCita.toISOString().split('T')[0],
          hora: hora,
        });
      }
      diasFaltantes--;
    }
    fechaCita = addDaysSkippingWeekends(fechaCita, 1);
  }
};

const agregarCitasSiEsNecesario = async () => {
  const medicos = await getMedicos();
  const enfermeros = await getEnfermeros();

  for (const numero_identificacion of medicos) {
    await programarCitasParaMedico(numero_identificacion, enfermeros);
  }
};

// Function to change state of citas where colaborador with jerarquia Médico is deleted to 'cancelada'
const deleteCitas = async () => {
  const result = await pool.query(
    `UPDATE citas_medicas SET estado = 'Cancelada' WHERE id_medico IN (SELECT numero_identificacion FROM colaboradores WHERE jerarquia = 'Médico' AND is_deleted = true) RETURNING *`
  );
  return result.rows;
};

module.exports = {
  agregarCitasSiEsNecesario,
  deleteCitas,
};
