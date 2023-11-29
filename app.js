const express = require('express');
const cors = require('cors');

const { config } = require('./config/envConfig');

const loadEndpoints = require('./src/routes');

const cron = require('node-cron');
const {
  agregarCitasSiEsNecesario,
  deleteCitas,
} = require('./src/utils/generateCitas');

const app = express();

app.use((req, res, next) => {
  console.log(`Request received: ${req.method} ${req.url}`);
  next();
});

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors());

cron.schedule('0 0 * * *', async () => {
  console.log('Ejecutando la tarea de generación de citas a medianoche');
  try {
    await agregarCitasSiEsNecesario();
    await deleteCitas();
    console.log('Tarea completada con éxito');
  } catch (error) {
    console.error('Error al ejecutar la tarea de generación de citas:', error);
  }
});

app.use('/uploads', express.static('./uploads'));
loadEndpoints(app);

app.set('port', config.port);

app.listen(app.get('port'), () => {
  console.log(`Server on port ${app.get('port')}`);
});