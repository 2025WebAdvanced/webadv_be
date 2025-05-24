const sql = require('../config/db');

const Comment = function(comment) {
  this.content = comment.content;
}

Comment.create = (comment, result) => {
  sql.query('INSERT INTO Comments (content, userId, postId) VALUES (?, ?, ?)'
    , [comment.content, comment.userId, comment.postId]
    , (err, res) => {
      if (err) {
        console.log('error occured in Comment.create', err);
        result(err, null);
      }
      else
        result(null, res);
    }
  );
}