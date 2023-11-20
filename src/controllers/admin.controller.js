const pool = require('../../config/dbConfig');
const userController = require('./user.controller');

const addColaborador = async (req, res) => {
  try {
    const { tipo_identificacion, numero_identificacion, nombre, apellido, fecha_nacimiento, estado_civil,
      sexo, direccion, telefono, correo_electronico, salario, jerarquia, fecha_ingreso, especialidad,
    } = req.body;

    const result = await pool.query(
      `INSERT INTO colaboradores 
        (tipo_identificacion, numero_identificacion, nombre, apellido, fecha_nacimiento, estado_civil, sexo, direccion, telefono, correo_electronico, salario, fecha_ingreso, jerarquia, especialidad)
      VALUES 
        ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
      RETURNING *`,
      [tipo_identificacion, numero_identificacion, nombre, apellido, fecha_nacimiento, estado_civil, sexo, direccion, telefono, correo_electronico, salario, fecha_ingreso, jerarquia, especialidad ]
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

const getAllColaboradores = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM colaboradores');
    res.json(result.rows);
  } catch (err) {
    res.status(500).send(err.message);
  }
};

const getColaboradorByNumId = async (req, res) => {
  try {
    const { numero_identificacion } = req.params;
    const result = await pool.query('SELECT * FROM colaboradores WHERE numero_identificacion = $1', [numero_identificacion]);
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).send(err.message);
  }
};

const getDeletedColaboradores = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM colaboradores WHERE is_deleted = true');
    res.json(result.rows[0]);
  } catch (err) {
    console.log(err.message);
    res.status(500).send(err.message);
  }
}

const updateColaborador = async (req, res) => {
  try {
    const { id, tipo_identificacion, numero_identificacion, nombre, apellido, fecha_nacimiento, estado_civil, sexo, direccion, telefono, correo_electronico, salario, fecha_ingreso, jerarquia, especialidad, usuario_id } = req.body;
    const updateTimestamp = new Date();
    const result = await pool.query(
      `UPDATE colaboradores 
      SET tipo_identificacion = $1, numero_identificacion = $2, nombre = $3, apellido = $4, fecha_nacimiento = $5, estado_civil = $6, sexo = $7, direccion = $8, telefono = $9, correo_electronico = $10, salario = $11, fecha_ingreso = $12, jerarquia = $13, especialidad = $14, usuario_id = $15, updated_at = $17 
      WHERE id = $16 AND is_deleted = FALSE
      RETURNING *`,
      [tipo_identificacion, numero_identificacion, nombre, apellido, fecha_nacimiento, estado_civil, sexo, direccion, telefono, correo_electronico, salario, fecha_ingreso, jerarquia, especialidad, usuario_id, id, updateTimestamp]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).send(err.message);
  }
};
 
const deleteColaborador = async (req, res) => {
  try {
    const { numero_identificacion } = req.params;
    const deleteTimestamp = new Date();
    await pool.query('UPDATE colaboradores SET is_deleted = $1, deleted_at = $2 WHERE numero_identificacion = $3', [true, deleteTimestamp, numero_identificacion]);
    res.json({ msg: 'Colaborador deleted' });
  } catch (err) {
    res.status(500).send(err.message);
  }
};
  
const patchColaborador = async (req, res) => {
  try {
    const { numero_identificacion } = req.params;
    const keys = Object.keys(req.body).filter(key => key !== 'id');
    const values = keys.map(key => req.body[key]);
    const setString = keys.map((key, index) => `${key} = $${index + 1}`).join(', ');

    const query = `UPDATE colaboradores SET ${setString} WHERE numero_identificacion = $${keys.length + 1} RETURNING *`;
    const result = await pool.query(query, [...values, numero_identificacion]);

    res.json(result.rows[0]).status(200);
  } catch (err) {

    res.status(500).send(err.message);
  }
};
  
module.exports = {
    getAllColaboradores,
    getColaboradorByNumId,
    getDeletedColaboradores,
    addColaborador,
    updateColaborador,
    deleteColaborador,
    patchColaborador,
};
