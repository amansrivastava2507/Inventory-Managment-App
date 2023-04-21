const express = require('express');
const connection = require('./server');

const cors = require('cors');
const app = express();
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Server is running');
});

app.post('/login', (req, res) => {
  const { email, password } = req.body;

  connection.query(
    'SELECT * FROM users WHERE email = ? AND password = ?',
    [email, password],
    (err, results) => {
      if (err) {
        console.error('Error executing query: ', err);
        res.status(500).send('Server error');
        return;
      }

      if (results.length === 0) {
        res.status(401).send('Invalid email or password');
      } else {
        const user = results[0];
        res.json(user);
      }
    }
  );
});

app.listen(3001, () => {
  console.log('Server started on port 3001');
});
