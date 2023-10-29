const router = require('express').Router();

router.post('/colaboradores', (req, res) => { 
    res.send('Colaboradores POST');  
});

router.get('/colaboradores', (req, res) => {
    res.send('Colaboradores GET');
});

router.get('/colaboradores/:id', (req, res) => {
    res.send('Colaboradores GET by ID');
});

router.put('/colaboradores', (req, res) => {
    res.send('Colaboradores PUT');
});

router.delete('/colaboradores/:id', (req, res) => {
    res.send('Colaboradores DELETE');
});

router.get('/colaboradores/search', (req, res) => {
    res.send('Colaboradores SEARCH');
});

module.exports = router;