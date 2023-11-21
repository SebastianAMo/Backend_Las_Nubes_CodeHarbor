const express = require('express');
const cors = require('cors');

const { config } = require("./config/envConfig");
const { db } = require("./config/dbConfig")
const upload = require('./src/middlewares/multer');

const loadEndpoints = require('./src/routes');

const app = express();

app.use((req, res, next) => {
  console.log(`Request received: ${req.method} ${req.url}`);
  next();
});

app.post('/api/upload',upload.single("foto_url") ,(req, res) => { 
  console.log(req.body);
  res.send('Upload received');
}
);
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors());

loadEndpoints(app);

app.set('port', config.port);

app.listen(app.get('port'), () => {
  console.log(`Server on port ${app.get('port')}`);
}
);