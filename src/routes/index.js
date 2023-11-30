const router = require('express').Router();

const pacientesRouter = require('./pacientes.router');
const adminRouter = require('./admin.router');
const medicamentosRouter = require('./medicamentos.router');
const chatbotRouter = require('./chatbot.router');
const colaboradoresRouter = require('./colaboradores.router');
const citasRouter = require('./citas.router');
const medicamentos_recetados=require('./medicamentosRecetados.router');
const authRouter = require('./auth.router');

const formulasMedicasrouter = require('./formulasMedicas.router');

const loadEndpoints = (app) => {
    app.use('/api', router);
    router.use('/admin', adminRouter);
    router.use('', pacientesRouter);
    router.use('', medicamentosRouter);
    router.use('', chatbotRouter);
    router.use('', formulasMedicasrouter);
    router.use('',medicamentos_recetados);
    router.use('/users', colaboradoresRouter);
    router.use('/citas', citasRouter);
    router.use('/auth', authRouter);



}

module.exports = loadEndpoints;