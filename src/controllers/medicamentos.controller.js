// Importaciones necesarias
const Medicamento= require('../models/medicamentos.model');
const createMedicamento = async (req, res) => {
    try {
        const {
            denominacion,
            proveedor,
            lote,
            tipo,
            cantidad_total,
            fecha_vencimiento,
            precio_unidad,
            grupo,
            subgrupo,
            alto_costo,
            alerta_vencimiento
        } = req.body;

        const nuevoMedicamento = await Medicamento.create({
            denominacion,
            proveedor,
            lote,
            tipo,
            cantidad_total,
            fecha_vencimiento,
            precio_unidad,
            grupo,
            subgrupo,
            alto_costo,
            alerta_vencimiento
        });

        res.status(201).json(nuevoMedicamento);
    } catch (error) {
        res.status(500).send(error.message);
    }
};
const getMedicamentos = async (req, res) => {
    let { alto_costo, grupo, subgrupo, id } = req.query;
    let filtro = {};
    if (alto_costo !== undefined) filtro.alto_costo = alto_costo;
    if (grupo) filtro.grupo = grupo;
    if (subgrupo) filtro.subgrupo = subgrupo;
    if (id) filtro.id = id;

    try {
        const medicamentos = await Medicamento.findAll({ where: filtro });
        res.json(medicamentos);
    } catch (error) {
        res.status(500).send(error.message);
    }
};
const updateMedicamento = async (req, res) => {
    const { id } = req.params;
    const datosActualizados = req.body;

    try {
        const medicamento = await Medicamento.findByPk(id);
        if (!medicamento) {
            return res.status(404).send('Medicamento no encontrado');
        }

        await medicamento.update(datosActualizados);
        res.json(medicamento);
    } catch (error) {
        res.status(500).send(error.message);
    }
};
const deleteMedicamento = async (req, res) => {
    const { id } = req.params;

    try {
        const medicamento = await Medicamento.findByPk(id);
        if (!medicamento) {
            return res.status(404).send('Medicamento no encontrado');
        }

        await medicamento.destroy();
        res.send('Medicamento eliminado');
    } catch (error) {
        res.status(500).send(error.message);
    }
};




const verificarVencimientos = async () => {
    try {
        const hoy = moment();
        const fechaLimite = hoy.add(1, 'months').toDate(); // Fecha límite (un mes a partir de hoy)

        const medicamentosProximosAVencer = await Medicamento.findAll({
            where: {
                fecha_vencimiento: {
                    [Op.lte]: fechaLimite // Medicamentos que vencen en o antes de la fecha límite
                }
            }
        });

        medicamentosProximosAVencer.forEach(medicamento => {
            enviarAlerta(`El medicamento ${medicamento.denominacion} está próximo a vencer.`);
        });
    } catch (error) {
        console.error('Error al verificar vencimientos:', error);
    }
};

// Ejecutar la verificación una vez al día
const cron = require('node-cron');
cron.schedule('0 0 * * *', verificarVencimientos); // Se ejecuta todos los días a medianoche

module.exports = {
    createMedicamento,
    getMedicamentos,
    updateMedicamento,
    deleteMedicamento
};