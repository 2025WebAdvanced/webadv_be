const sql = require('../config/db');

const User = function(user) {
  this.email = user.email;
  this.username = user.username;
  this.password = user.password;
  this.univ = user.univ;
};

User.create = (user, result) => {
  sql.query(`INSERT INTO Users (email, username, password, createdAt, univ) VALUES (?, ?, ?, NOW(), ?)`,
    [ user.email, user.username, user.password, user.univ ],
    (err, res) => {
      if (err) {
        console.log('error occured in User.create: ', err);
        result(err, null);
      }
      else
        result(null, res);
    });
}

User.findByEmail = (email, result) => {
  sql.query(`SELECT * FROM Users WHERE email=?`, [email],
    (err, res) => {
      if (err) {
        console.log('error occured in User.findByEmail', err);
        result(err, null);
      }
      else
        result(null, res);
    });
}

module.exports = User;