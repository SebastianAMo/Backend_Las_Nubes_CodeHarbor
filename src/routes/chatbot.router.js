const router = require('express').Router();

router.post('/chatbot', (req, res) => {
  res.send('Chatbot POST');
});

module.exports = router;
