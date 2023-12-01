const pool = require('../../config/dbConfig');

let cacheMedicos = null;
let cacheEnfermeros = null;

// Función para obtener los números de identificación de todos los médicos
const getMedicos = async () => {
  if (!cacheMedicos) {
    const result = await pool.query(
      "SELECT numero_identificacion FROM colaboradores WHERE jerarquia = 'Médico' and is_deleted = false"
    );
    cacheMedicos = result.rows.map((row) => row.numero_identificacion);
  }
  return cacheMedicos;
};

// Función para obtener los números de identificación de los enfermeros
const getEnfermeros = async () => {
  if (!cacheEnfermeros) {
    const result = await pool.query(
      "SELECT numero_identificacion FROM colaboradores WHERE jerarquia = 'Enfermero' and is_deleted = false"
    );
    cacheEnfermeros = result.rows.map((row) => row.numero_identificacion);
  }
  return cacheEnfermeros;
};

const getLastCita = async (numero_identificacion) => {
  const result = await pool.query(
    `SELECT MAX(fecha) as ultima_fecha_cita FROM citas_medicas WHERE id_medico = $1 GROUP BY id_medico;`,
    [numero_identificacion]
  );
  
  let referenciaFecha = new Date();
  if (result.rows.length > 0) {
    const ultimaFechaCita = new Date(result.rows[0].ultima_fecha_cita);
    if (ultimaFechaCita >= referenciaFecha) {
      referenciaFecha = addDaysSkippingWeekends(referenciaFecha, 1);
    } else {
      referenciaFecha = addDaysSkippingWeekends(referenciaFecha, 10);
    }
  } else {
    referenciaFecha = addDaysSkippingWeekends(referenciaFecha, 10);
  }

  return referenciaFecha.toISOString().split('T')[0]; // Retorna la fecha en formato 'YYYY-MM-DD'
};

const createCita = async (citaData) => {
  const estado = 'Sin asignar';
  await pool.query(
    `INSERT INTO citas_medicas (id_medico, id_enfermero, fecha, hora, estado) 
     VALUES ($1, $2, $3, $4, $5)`,
    [
      citaData.id_medico,
      citaData.id_enfermero,
      citaData.fecha,
      citaData.hora,
      estado,
    ]
  );
};

// Resto del código (addDaysSkippingWeekends, generarHorarios) permanece igual

const programarCitasParaMedico = async (numero_identificacion, enfermeros) => {
  let fechaInicio = await getLastCita(numero_identificacion);
  let fechaLimite = addDaysSkippingWeekends(new Date(), 10);
  let fechaCita = new Date(fechaInicio);

  while (fechaCita < fechaLimite) {
    if (fechaCita.getDay() !== 0) {
      const horarios = generarHorarios();
      for (const hora of horarios) {
        const idEnfermeroAsignado = await asignarEnfermeraACita(
          fechaCita.toISOString().split('T')[0],
          hora,
          enfermeros
        );

        if (idEnfermeroAsignado) {
          await createCita({
            id_medico: numero_identificacion,
            id_enfermero: idEnfermeroAsignado,
            fecha: fechaCita.toISOString().split('T')[0],
            hora: hora,
          });
        }
      }
    }
    fechaCita = addDaysSkippingWeekends(fechaCita, 1);
  }
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
