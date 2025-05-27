kconst sql = require('../config/db');

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

// async/await 기반 댓글 조회 함수 추가 (페이지네이션 용)
Comment.getCommentsByPostId = async (postId, limit, offset) => {
  const [comments] = await sql.query(
    'SELECT * FROM Comments WHERE postId = ? ORDER BY createdAt ASC LIMIT ? OFFSET ?',
    [postId, limit, offset]
  );
  return comments;
};

Comment.getTotalCommentsCount = async (postId) => {
  const [[result]] = await sql.query(
    'SELECT COUNT(*) AS total FROM Comments WHERE postId = ?',
    [postId]
  );
  return result.total;
};

module.exports = Comment;

