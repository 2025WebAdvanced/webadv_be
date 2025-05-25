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

Comment.update = (comment, result) => {
  sql.query('UPDATE Comments SET content=? WHERE id=?'
    , [comment.content, comment.id]
    , (err, res) => {
      if (err) {
        console.log('error occured in Comment.update', err);
        result(err, null);
      }
      else
        result(null, res);
    }
  )
}

Comment.getCommentById = (commentId, result) => {
  sql.query('SELECT * FROM Comments WHERE id=?', [commentId], (err, res) => {
    if (err) {
      console.log('error oucured in Comment.getCommentById', err);
      result(err, null);
    }
    else
      result(null, res[0]);
  })
}

module.exports = Comment;