// models/medicamentos.model.js
const pool = require('../../config/dbConfig');

const createMedicamento = async (medicamentoData) => {
  const {
    denominacion, proveedor, lote, tipo, cantidad_total, fecha_vencimiento,
    precio_unidad, grupo, subgrupo, alto_costo, alerta_vencimiento
  } = medicamentoData;

  const result = await pool.query(
    'INSERT INTO medicamentos (denominacion, proveedor, lote, tipo, cantidad_total, fecha_vencimiento, precio_unidad, grupo, subgrupo, alto_costo, alerta_vencimiento) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) RETURNING *',
    [denominacion, proveedor, lote, tipo, cantidad_total, fecha_vencimiento, precio_unidad, grupo, subgrupo, alto_costo, alerta_vencimiento]
  );
  return result.rows[0];
};

const getMedicamentos = async (filters) => {
  let query = 'SELECT * FROM medicamentos';
  const { id, precio, grupo, subgrupo } = filters;
  let conditions = [];
  let values = [];

  if (id) {
    conditions.push(`id = $${values.length + 1}`);
    values.push(id);
  }
  if (precio) {
    conditions.push(`precio_unidad = $${values.length + 1}`);
    values.push(precio);
  }
  if (grupo) {
    conditions.push(`grupo = $${values.length + 1}`);
    values.push(grupo);
  }
  if (subgrupo) {
    conditions.push(`subgrupo = $${values.length + 1}`);
    values.push(subgrupo);
  }

  if (conditions.length > 0) {
    query += ' WHERE ' + conditions.join(' AND ');
  }

  const result = await pool.query(query, values);
  return result.rows;
};

const updateMedicamento = async (id, updateFields) => {
  const keys = Object.keys(updateFields);
  const values = keys.map((key) => updateFields[key]);

  const setString = keys.map((key, index) => `${key} = $${index + 1}`).join(', ');

  const query = `UPDATE medicamentos SET ${setString} WHERE id = $${keys.length + 1} RETURNING *`;
  const result = await pool.query(query, [...values, id]);

  return result.rows[0];
};

const deleteMedicamento = async (id) => {
  const result = await pool.query('DELETE FROM medicamentos WHERE id = $1', [id]);
  return result.rowCount;
};

const getMedicamentosProximosAVencer = async () => {
  const result = await pool.query(
    "SELECT * FROM medicamentos WHERE fecha_vencimiento <= CURRENT_DATE + INTERVAL '30 days'"
  );
  return result.rows;
};



// Métodos adicionales para actualizar, eliminar y alertas de vencimiento

module.exports = {
  updateMedicamento,
  deleteMedicamento,
  getMedicamentos,
  createMedicamento,
  getMedicamentosProximosAVencer,
};