const citasModel = require('../models/citas.model');

const getEspecialidades = async (req, res) => {
  try {
    const especialidades = await citasModel.getEspecialidades();
    if (especialidades.length === 0) {
      res.json({ message: 'No hay especialidades disponibles' }).status(404);
      return;
    }
    res.json(especialidades).status(200);
  }
  catch (error) {
    res.json({ message: error.message }).status(500);
  }
};

const getCitasMedicos = async (req, res) => {
  try {
    const especialidad = req.params.especialidad;
    const citas = await citasModel.getCitasMedicos(especialidad);
    if (citas.length === 0) {
      res.json({ message: 'No hay citas disponibles' }).status(404);
      return;
    }
    res.json(citas).status(200);
  }
  catch (error) {
    res.json({ message: error.message }).status(500);
  }
}

const getCitasMedico = async (req, res) => {
  try {
    const id_medico = req.params.id_medico;
    const citas = await citasModel.getCitasMedico(id_medico);
    if (citas.length === 0) {
      res.json({ message: 'No hay citas disponibles' }).status(404);
      return;
    }
    res.json(citas).status(200);
  }
  catch (error) {
    res.json({ message: error.message }).status(500);
  }
};

const getCitasSinAsignar = async (req, res) => {
  try {
    const citas = await citasModel.getCitasSinAsignar();
    res.json(citas).status(200);
  } catch (error) {
    res.json({ message: error.message }).status(500);
  }
};

const getCitasPacienteActivas = async (req, res) => {
  try {
    const numero_identificacion = req.params.numero_identificacion;
    const citas = await citasModel.getCitasPacienteActivas(
      numero_identificacion
    );
    res.json(citas).status(200);
  } catch (error) {
    res.json({ message: error.message }).status(500);
  }
};

const getCitasActivas = async (req, res) => {
  try {
    const citas = await citasModel.getCitasActivas();
    res.json(citas).status(200);
  } catch (error) {
    res.json({ message: error.message }).status(500);
  }
};

const getCitasEnfermero = async (req, res) => {
  try {
    const numero_identificacion = req.params.numero_identificacion;
    const citas = await citasModel.getCitasEnfermero(numero_identificacion);
    res.json(citas).status(200);
  } catch (error) {
    res.json({ message: error.message }).status(500);
  }
};

//La consulta del medico para ver sus citas activas pendientes del día actual
const getCitasMedicoActivas = async (req, res) => {
  try {
    const numero_identificacion = req.params.numero_identificacion;
    const citas = await citasModel.getCitasByState(
      numero_identificacion,
      'Activa'
    );
    res.json(citas).status(200);
  } catch (error) {
    res.json({ message: error.message }).status(500);
  }
};

const getCitasMedicoConfirmadas = async (req, res) => {
  try {
    const numero_identificacion = req.params.numero_identificacion;
    const citas = await citasModel.getCitasByState(
      numero_identificacion,
      'Confirmada'
    );
    res.json(citas).status(200);
  } catch (error) {
    res.json({ message: error.message }).status(500);
  }
};

const getCitasMedicoenCita = async (req, res) => {
  try {
    const numero_identificacion = req.params.numero_identificacion;
    const citas = await citasModel.getCitasByState(
      numero_identificacion,
      'En cita'
    );
    res.json(citas).status(200);
  } catch (error) {
    res.json({ message: error.message }).status(500);
  }
};

const pedirCita = async (req, res) => {
  try {
    const id_cita = req.params.id_cita;
    const citaData = req.body;
    const cita = await citasModel.getCitaById(id_cita);

    if (!citaData.id_paciente) {
      res.json({ message: 'El id_paciente es requerido' }).status(400);
      return;
    }
    if (!cita) {
      res.json({ message: 'La cita no existe' }).status(404);
      return;
    }

    if (cita.estado !== 'Sin asignar') {
      res.json({ message: 'La cita no está disponible' }).status(400);
      return;
    }

    const result = await citasModel.updateCita(id_cita, {
      estado: 'Activa',
      ...citaData,
    });
    res.json(result).status(200);
  } catch (error) {
    res.json({ message: error.message }).status(500);
  }
};

const cancelCita = async (req, res) => {
  try {
    const id_cita = req.params.id_cita;
    const cita = await citasModel.getCitaById(id_cita);

    if (!cita) {
      res.json({ message: 'La cita no existe' }).status(404);
      return;
    }

    if (cita.estado !== 'Activa') {
      res.json({ message: 'La cita no está activa' }).status(400);
      return;
    }

    const result = await citasModel.updateCita(id_cita, {
      estado: 'Cancelada',
    });

    res.json(result).status(200);
  } catch (error) {
    res.json({ message: error.message }).status(500);
  }
};

const updateCita = async (req, res) => {
  try {
    const id_cita = req.params.id_cita;
    const citaData = req.body;
    const cita = await citasModel.getCitaById(id_cita);

    if (!cita) {
      res.json({ message: 'La cita no existe' }).status(404);
      return;
    }

    const result = await citasModel.updateCita(id_cita, citaData);

    res.json(result).status(200);
  } catch (error) {
    res.json({ message: error.message }).status(500);
  }
};

module.exports = {
  getEspecialidades,
  getCitasMedicos,
  getCitasMedico,
  getCitasSinAsignar,
  getCitasPacienteActivas,
  getCitasActivas,
  getCitasMedicoActivas,
  getCitasMedicoConfirmadas,
  getCitasMedicoenCita,
  getCitasEnfermero,
  pedirCita,
  cancelCita,
  updateCita,
};
