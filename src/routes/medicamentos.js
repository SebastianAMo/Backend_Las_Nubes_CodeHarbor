const router = require('express').Router();

router.post('/medicamentos', (req, res) => { 
    res.send('Medicamentos POST');  
});

router.get('/medicamentos', (req, res) => {
    res.send('Medicamentos GET');
});

router.get('/medicamentos/:id', (req, res) => {
    res.send('Medicamentos GET by ID');
});


router.put('/medicamentos/:id', (req, res) => {
    res.send('Medicamentos PUT');
});


router.delete('/medicamentos/:id', (req, res) => {
    res.send('Medicamentos DELETE');
});

router.get('/medicamentos/search', (req, res) => {
    res.send('Medicamentos SEARCH');
});

module.exports = router;