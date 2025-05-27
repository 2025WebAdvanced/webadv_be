const sql = require('../config/db');

// callback 기반 기존 함수들
const Comment = function(comment) {
  this.content = comment.content;
}

Comment.create = (comment, result) => {
  sql.query(
    'INSERT INTO Comments (content, userId, postId) VALUES (?, ?, ?)',
    [comment.content, comment.userId, comment.postId],
    (err, res) => {
      if (err) {
        console.log('error occured in Comment.create', err);
        result(err, null);
      } else {
        result(null, res);
      }
    }
  );
}

Comment.update = (comment, result) => {
  sql.query(
    'UPDATE Comments SET content=? WHERE id=?',
    [comment.content, comment.id],
    (err, res) => {
      if (err) {
        console.log('error occured in Comment.update', err);
        result(err, null);
      } else {
        result(null, res);
      }
    }
  );
}

Comment.delete = (commentId, result) => {
  sql.query(
    'DELETE FROM Comments WHERE id=?',
    [commentId],
    (err, res) => {
      if (err) {
        console.log('error occured in Comment.delete', err);
        result(err, null);
      } else {
        result(null, res);
      }
    }
  );
}

Comment.getCommentById = (commentId, result) => {
  sql.query(
    'SELECT * FROM Comments WHERE id=?',
    [commentId],
    (err, res) => {
      if (err) {
        console.log('error occured in Comment.getCommentById', err);
        result(err, null);
      } else {
        result(null, res[0]);
      }
    }
  );
}

// async/await 기반 함수들은 별도 함수로 정의
const getCommentsByPostId = async (postId, limit, offset) => {
  const [comments] = await sql.query(
    'SELECT * FROM Comments WHERE postId = ? ORDER BY createdAt ASC LIMIT ? OFFSET ?',
    [postId, limit, offset]
  );
  return comments;
};

const getTotalCommentsCount = async (postId) => {
  const [[result]] = await sql.query(
    'SELECT COUNT(*) AS total FROM Comments WHERE postId = ?',
    [postId]
  );
  return result.total;
};

// callback 기반 함수는 Comment 객체로, async 함수들은 별도로 export
module.exports = {
  Comment,
  getCommentsByPostId,
  getTotalCommentsCount,
};
