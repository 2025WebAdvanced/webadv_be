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
      result(null, res);
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
  db.query('DELETE From Comments WHERE id=?', [commentId], (err, res) => {
    if (err) {
      console.log('error occured in Comment.delete', err);
      result(err, null);
    } else {
      result(null, res);
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

// async/await 함수들
const getCommentsByPostId = async (postId, limit, offset) => {
  const [comments] = await db.query(
    'SELECT * FROM Comments WHERE postId = ? ORDER BY createdAt ASC LIMIT ? OFFSET ?',
    [postId, limit, offset]
  );
  return comments;
};

const getTotalCommentsCount = async (postId) => {
  const [[result]] = await db.query(
    'SELECT COUNT(*) AS total FROM Comments WHERE postId = ?',
    [postId]
  );
  return result.total;
};

module.exports = {
  Comment,
  getCommentsByPostId,
  getTotalCommentsCount,
};

