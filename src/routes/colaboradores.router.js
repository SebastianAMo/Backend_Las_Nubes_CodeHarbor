const router = require('express').Router();

const {
  getUsers,
  getUserById,
  updateUser,
  disabledUser,
  activeUser,
  getInforme
} = require('../controllers/colaboradores.controller');
const authenticate = require('../middlewares/auth');
const authorize = require('../middlewares/authorize');

//router.delete('/:id', authenticate, authorize(['admin']), disabledUser);

router.get('/', getUsers);
router.get('/:id',  getUserById);
router.patch('/:id',  updateUser);
router.delete('/:id',  disabledUser);
router.patch('/activate/:id',  activeUser);
router.get('/informe/:option',getInforme);

/*
router.get('/informe', async (req, res) => {
    try {
        const datos = await obtenerDatosParaPDF(); // Reemplaza con tu lógica para obtener datos
        const pdfBuffer = await generarPDFConDatos(datos);
  
        res.writeHead(200, {
            'Content-Length': Buffer.byteLength(pdfBuffer),
            'Content-Type': 'application/pdf',
            'Content-disposition': 'attachment;filename=informe.pdf',
        });
        res.end(pdfBuffer);
    } catch (error) {
        console.error('Error al generar el PDF:', error);
        res.status(500).send('Error interno del servidor');
    }
  });
*/

module.exports = router;
