const express     = require('express');
const path        = require('path');
const serveStatic = require('serve-static');
const web3        = require('web3');
const shop        = process.env.STORE;

let app           = express();
app.use(serveStatic(__dirname + "/dist"));

const port        = process.env.PORT || 5000;
app.listen(port, () => {
  console.log('Listening on port ' + port)
});

console.log(web3.version);
