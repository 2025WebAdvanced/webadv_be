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
