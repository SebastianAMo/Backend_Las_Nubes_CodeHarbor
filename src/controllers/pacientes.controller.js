const pool = require('../../config/dbConfig');
const userController = require('./user.controller');

const addPaciente = async (req, res) => {
  try{
    const { tipo_identificacion, numero_identificacion, nombre, apellido, fecha_nacimiento, estado_civil, sexo, direccion, telefono, correo_electronico, usuario_id } = req.body;

    const result = await pool.query(
      `INSERT INTO pacientes 
        (tipo_identificacion, numero_identificacion, nombre, apellido, fecha_nacimiento, estado_civil, sexo, direccion, telefono, correo_electronico, usuario_id)
      VALUES 
        ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      RETURNING *`,
      [tipo_identificacion, numero_identificacion, nombre, apellido, fecha_nacimiento, estado_civil, sexo, direccion, telefono, correo_electronico, usuario_id]
    );

    const userCreationResponse = await userController.createUser({
      username: numero_identificacion,
      password: numero_identificacion
    });

    if (!userCreationResponse.success) {
      throw new Error(userCreationResponse.error);
    }

    res.status(201).json(result.rows[0]);
      
  } catch (err) {
    res.status(500).send(err.message);
  }
};

const getAllPacientes = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM pacientes');
    res.json(result.rows);
  } catch (err) {
    res.status(500).send(err.message);
  }
}

const getPacienteByNumId = async (req, res) => {
  try {
    const { numero_identificacion } = req.params;
    const result = await pool.query('SELECT * FROM pacientes WHERE numero_identificacion = $1 AND is_deleted = FALSE', [numero_identificacion]);
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).send(err.message);
  }
}

const getDeletedPacientes = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM pacientes WHERE is_deleted = TRUE');
    res.json(result.rows);
  } catch (err) {
    res.status(500).send(err.message);
  }
}

const updatePaciente = async (req, res) => {
  try {
    const { id, tipo_identificacion, numero_identificacion, nombre, apellido, fecha_nacimiento, estado_civil, sexo, direccion, telefono, correo_electronico, usuario_id } = req.body;
    const updateTimestamp = new Date();
    const result = await pool.query(
      `UPDATE pacientes 
      SET tipo_identificacion = $1, numero_identificacion = $2, nombre = $3, apellido = $4, fecha_nacimiento = $5, estado_civil = $6, sexo = $7, direccion = $8, telefono = $9, correo_electronico = $10, usuario_id = $11, updated_at = $13
      WHERE id = $12
      RETURNING *`,
      [tipo_identificacion, numero_identificacion, nombre, apellido, fecha_nacimiento, estado_civil, sexo, direccion, telefono, correo_electronico, usuario_id, id, updateTimestamp]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).send(err.message);
  }
};

const deletePaciente = async (req, res) => {
  try {
    const { id } = req.params;
    const deleteTimestamp = new Date();
    await pool.query('UPDATE pacientes SET is_deleted = $1, deleted_at = $2 WHERE id = $3', [true, deleteTimestamp, id]);
    res.json({ msg: 'Paciente deleted logically' });
  } catch (err) {
    res.status(500).send(err.message);
  }
};

const patchPaciente = async (req, res) => {
  try {
    const { numero_identificacion } = req.params;
    const keys = Object.keys(req.body).filter(key => key !== 'id');
    const values = keys.map(key => req.body[key]);
    const setString = keys.map((key, index) => `${key} = $${index + 1}`).join(', ');

    const query = `UPDATE pacientes SET ${setString} WHERE id = ${id} RETURNING *`;
    const result = await pool.query(query, [...values, numero_identificacion]);
    
    res.json(result.rows[0]).status(200);

  }catch (err) {
    res.status(500).send(err.message);
  }
};

module.exports = {
  addPaciente,
  getAllPacientes,
  getPacienteByNumId,
  getDeletedPacientes,
  updatePaciente,
  deletePaciente,
  patchPaciente
};