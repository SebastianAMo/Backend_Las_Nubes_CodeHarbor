const pool = require('../../config/dbConfig');

const addColaborador = async (req, res) => {
  try {
    const {
      tipoDocumento,
      numeroDocumento,
      nombres,
      apellidos,
      fechaNacimiento,
      estadoCivil,
      sexo,
      direccion,
      telefono,
      correo,
      salario,
      fechaIngreso,
      jerarquia,
      especialidad,
    } = req.body;

    const result = await pool.query(
      `INSERT INTO colaboradores 
        (tipo_identificacion, numero_identificacion, nombre, apellido, fecha_nacimiento, estado_civil, sexo, direccion, telefono, correo_electronico, salario, fecha_ingreso, jerarquia, especialidad)
      VALUES 
        ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
      RETURNING *`,
      [tipoDocumento, numeroDocumento, nombres, apellidos, fechaNacimiento, estadoCivil, sexo, direccion, telefono, correo, salario, fechaIngreso, jerarquia, especialidad]
    );

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
  
const updateColaborador = async (req, res) => {
  try {
    const { id, tipo_identificacion, numero_identificacion, nombre, apellido, fecha_nacimiento, estado_civil, sexo, direccion, telefono, correo_electronico, salario, fecha_ingreso, jerarquia, especialidad, usuario_id } = req.body;
    const result = await pool.query(
      `UPDATE colaboradores SET tipo_identificacion = $1, numero_identificacion = $2, nombre = $3, apellido = $4, fecha_nacimiento = $5, estado_civil = $6, sexo = $7, direccion = $8, telefono = $9, correo_electronico = $10, salario = $11, fecha_ingreso = $12, jerarquia = $13, especialidad = $14, usuario_id = $15 WHERE id = $16 RETURNING *`,
      [tipo_identificacion, numero_identificacion, nombre, apellido, fecha_nacimiento, estado_civil, sexo, direccion, telefono, correo_electronico, salario, fecha_ingreso, jerarquia, especialidad, usuario_id, id]
    );
    res.json(result.rows[0]);
  } catch (err) {

    res.status(500).send(err.message);
  }
};
  
const deleteColaborador = async (req, res) => {
  try {
    const { numero_identificacion } = req.params;
    await pool.query('DELETE FROM colaboradores WHERE numero_identificacion = $1', [numero_identificacion]);
    res.json({ msg: 'Colaborador deleted' });
  } catch (err) {

    res.status(500).send(err.message);
  }
};
  
const patchColaborador = async (req, res) => {
  try {
    const { numero_identificacion } = req.params;
    console.log(numero_identificacion);
    const keys = Object.keys(req.body).filter(key => key !== 'id');
    console.log(keys);
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
    addColaborador,
    updateColaborador,
    deleteColaborador,
    patchColaborador 
};
