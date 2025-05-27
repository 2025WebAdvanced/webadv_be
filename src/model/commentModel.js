<<<<<<< HEAD
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
// src/model/commentModel.js
const db = require('../config/db');

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
  getCommentsByPostId,
  getTotalCommentsCount,
};
