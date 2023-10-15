const express = require('express');
const cors = require('cors');

const { config } = require("./config/envConfig");
const { db } = require("./config/dbConfig")


const app = express();

app.use((req, res, next) => {
  console.log(`Request received: ${req.method} ${req.url}`);
  next();
});

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors());

app.set('port', config.port);

app.listen(app.get('port'), () => {
  console.log(`Server on port ${app.get('port')}`);
}
);