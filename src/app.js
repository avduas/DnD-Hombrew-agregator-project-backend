const express = require('express');
const pool = require('./config/db');
const app = express();
const port = 3000;

const authorization = require("./routes/authorization");

app.use(express.json());

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.use('/api', authorization);

app.get('/time', (req, res) => {
  pool.query('SELECT NOW()', (err, result) => {
    if (err) {
      console.error(err);
      res.status(500).send('Database error');
    } else {
      res.send(`Current time from database: ${result.rows[0].now}`);
    }
  });
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})