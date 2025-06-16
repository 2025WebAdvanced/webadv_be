const db = require('../config/db');

const Comment = function(comment) {
  this.content = comment.content;
};

Comment.create = (comment, result) => {
  db.query('INSERT INTO Comments (content, userId, postId) VALUES (?, ?, ?)', [comment.content, comment.userId, comment.postId], (err, res) => {
    if (err) {
      console.log('error occured in Comment.create', err);
      result(err, null);
    } else {
      db.query('UPDATE Posts SET comments = Posts.comments+1 WHERE id = ?', [comment.postId], (comerr, comres) => {
        if (err) {
          console.log('error occured in Comment.create', comerr);
          result(err, null);
        } else {
          db.query('SELECT Comments.*, username FROM Comments JOIN Users ON userId = Users.id WHERE Comments.id=?', [res.insertId], (selErr, selRes) => {
            if (selErr) {
              console.log('error occured in Comment.create', selErr);
              result(err, null);
            } else {
              result(null, selRes[0]);
            }
          })
        }
      })
    }
  });
};

Comment.update = (comment, result) => {
  db.query('UPDATE Comments SET content=? WHERE id=?', [comment.content, comment.id], (err, res) => {
    if (err) {
      console.log('error occured in Comment.update', err);
      result(err, null);
    } else {
      result(null, res);
    }
  });
};

Comment.delete = (commentId, result) => {
  db.query('UPDATE Posts SET comments = Posts.comments-1 WHERE id=(SELECT postId FROM Comments WHERE Comments.id=?)', [commentId], (err, res) => {
    if (err) {
      console.log('error occured in Comment.delete', err);
      result(err, null);
    } else {
      db.query('DELETE From Comments WHERE id=?', [commentId], (err, res) => {
        if (err) {
          console.log('error occured in Comment.delete', err);
          result(err, null);
        } else {
          result(null, res);
        }
      });
    }
  });
};

Comment.getCommentById = (commentId, result) => {
  db.query('SELECT * FROM Comments WHERE id=?', [commentId], (err, res) => {
    if (err) {
      console.log('error occured in Comment.getCommentById', err);
      result(err, null);
    } else {
      result(null, res[0]);
    }
  });
};

Comment.getAllCommentsByPostId = (postId, result) => {
  db.query(
      `SELECT Comments.*, Users.username FROM Comments JOIN Users ON Users.id = userId WHERE postId = ? ORDER BY createdAt`,
      [postId],
      (err, res) => {
        if (err) {
          console.log('error occured in Comment.getAllCommentsByPostId', err);
          result(err, null);
        } else {
          result(null, res);
        }
      }
  );
}

// async/await 함수들
Comment.getCommentsByPostId = async (postId, limit, offset) => {
  const [comments] = await db.query(
    'SELECT Comments.*, Users.username FROM Comments JOIN Users ON Users.id = userId WHERE postId = ? ORDER BY createdAt LIMIT ? OFFSET ?',
    [postId, limit, offset]
  );
  return comments;
};

Comment.getTotalCommentsCount = async (postId) => {
  const [[result]] = await db.query(
    'SELECT COUNT(*) AS total FROM Comments WHERE postId = ?',
    [postId]
  );
  return result.total;
};

module.exports = Comment;

