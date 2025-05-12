const express = require('express');
const router = express.Router();
const db = require('../config/db');

router.get('/', (req, res) => {
  db.query('SELECT * FROM users ORDER BY id DESC', (err, rows) => {
    if (err) throw err;
    res.json(rows);
  });
});

module.exports = router;
