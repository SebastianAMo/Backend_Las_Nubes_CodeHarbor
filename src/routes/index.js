const router = require('express').Router();

const pacientesRouter = require('./pacientes.router');
const adminRouter = require('./admin.router');
const medicamentosRouter = require('./medicamentos.router');
const chatbotRouter = require('./chatbot.router');
const colaboradoresRouter = require('./colaboradores.router');
const citasRouter = require('./citas.router');
const authRouter = require('./auth.router');
const userRouter = require('./user.router');

const loadEndpoints = (app) => {
    app.use('/api', router);
    router.use('/admin', adminRouter);
    router.use('', pacientesRouter);
    router.use('', medicamentosRouter);
    router.use('', chatbotRouter);
    router.use('', colaboradoresRouter);
    router.use('', citasRouter);
    router.use('/auth', authRouter);
    router.use('/users', userRouter);

}

module.exports = loadEndpoints;