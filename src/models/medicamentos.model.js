const { Sequelize, DataTypes } = require('sequelize');
const sequelize = new Sequelize('mi_base_de_datos', 'usuario', 'contraseña', {
  host: 'localhost',
  dialect: 'postgres' // o el dialecto que estés usando (postgres, sqlite, etc.)
});

const Medicamento = sequelize.define('Medicamento', {
  denominacion: {
    type: DataTypes.STRING,
    allowNull: false
  },
  proveedor: {
    type: DataTypes.STRING,
    allowNull: false
  },
  lote: {
    type: DataTypes.STRING,
    allowNull: false
  },
  tipo: {
    type: DataTypes.STRING,
    allowNull: false
  },
  cantidad_total: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  fecha_vencimiento: {
    type: DataTypes.DATE,
    allowNull: false
  },
  precio_unidad: {
    type: DataTypes.FLOAT,
    allowNull: false
  },
  grupo: {
    type: DataTypes.STRING,
    allowNull: false
  },
  subgrupo: {
    type: DataTypes.STRING,
    allowNull: true
  },
  alto_costo: {
    type: DataTypes.BOOLEAN,
    allowNull: false
  },
  alerta_vencimiento: {
    type: DataTypes.INTEGER,
    allowNull: false
  }
}, {
  // Opciones adicionales
});

module.exports = Medicamento;