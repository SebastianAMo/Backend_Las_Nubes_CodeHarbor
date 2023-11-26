const citasModel = require('../models/citas.model');

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

//La consulta del medico para ver sus citas activas pendientes del día actual
const getCitasMedicoActivas = async (req, res) => {
  try {
    const numero_identificacion = req.params.numero_identificacion;
    const citas = await citasModel.getCitasByState(
      numero_identificacion,
      'activa'
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
      'confirmada'
    );
    res.json(citas).status(200);
  } catch (error) {
    res.json({ message: error.message }).status(500);
  }
};

const getCitasMecicoenCita= async (req, res) => {
  try {
    const numero_identificacion = req.params.numero_identificacion;
    const citas = await citasModel.getCitasByState(
      numero_identificacion,
      'en cita'
    );
    res.json(citas).status(200);
  }catch (error) {
    res.json({ message: error.message }).status(500);
  }
}

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

    if (cita.estado !== 'sin asignar') {
      res.json({ message: 'La cita no está disponible' }).status(400);
      return;
    }

    const result = await citasModel.updateCita(id_cita, {
      estado: 'activa',
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

    if (cita.estado !== 'activa') {
      res.json({ message: 'La cita no está activa' }).status(400);
      return;
    }

    const result = await citasModel.updateCita(id_cita, {
      estado: 'cancelada',
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
  getCitasSinAsignar,
  getCitasPacienteActivas,
  getCitasActivas,
  getCitasMedicoActivas,
  getCitasMedicoConfirmadas,
  getCitasMecicoenCita,
  pedirCita,
  cancelCita,
  updateCita,
};
