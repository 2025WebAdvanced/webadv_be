const sql = require('../config/db');

const Token = function(token) {
  this.userId = token.userId;
  this.refreshToken = token.refreshToken;
  this.expiresAt = token.expiresAt;
};

Token.create = (token, result) => {
  sql.query('INSERT INTO Tokens (userId, refreshToken, expiresAt) VALUES (?, ?, ?)'
    ,[token.userId, token.refreshToken, token.expiresAt]
    , (err, res) => {
      if (err) {
        console.log('error occured in Token.create', err);
        result(err, null);
      } else
        result(null, res);
    }
  )
}

Token.deleteDeprecated = () => {
  sql.query('DELETE FROM Tokens WHERE TIMEDIFF(NOW(), expiresAt) > 0'
    , (err, res) => {
      if (err)
        console.log('error occured in Token.deleteDeprecated', err);
      else
        console.log('Deleted Successfully Deprecated RefreshTokens.');
    }
  )
}

Token.findByUserId = (userId, result) => {
  sql.query('SELECT * FROM Tokens WHERE userId=?'
    , [userId]
    , (err, res) => {
      if (err) {
        console.log('error occured in Token.findByUserId', err);
        result(err, null);
      } else
        result(null, res);
    }
  )
}

Token.findByRefreshToken = (token, result) => {
  sql.query('SELECT * FROM Tokens WHERE refreshToken=?'
    , [token]
    , (err, res) => {
      if (err) {
        console.log('error occured in Token.findByRefreshToken', err);
        result(err, null);
      } else
        result(null, res);
    }
  )
}

module.exports = Token;