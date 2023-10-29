const router = require('express').Router();

const pacientesRouter = require('./pacientes');
const adminRouter = require('./admin');
const medicamentosRouter = require('./medicamentos');
const chatbotRouter = require('./chatbot');
const colaboradoresRouter = require('./colaboradores');
const citasRouter = require('./citas');

const loadEndpoints = (app) => {
    app.use('/api', router);
    router.use('', pacientesRouter);
    router.use('', adminRouter);
    router.use('', medicamentosRouter);
    router.use('', chatbotRouter);
    router.use('', colaboradoresRouter);
    router.use('', citasRouter);
}

module.exports = loadEndpoints;