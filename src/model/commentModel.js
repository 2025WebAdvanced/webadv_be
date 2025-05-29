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

const createComment = async (comment) => {
  const [result] = await db.query(
    'INSERT INTO Comments (content, userId, postId) VALUES (?, ?, ?)',
    [comment.content, comment.userId, comment.postId]
  );
  return result;
};

const updateComment = async (comment) => {
  const [result] = await db.query(
    'UPDATE Comments SET content = ? WHERE id = ?',
    [comment.content, comment.id]
  );
  return result;
};

const deleteComment = async (commentId) => {
  const [result] = await db.query(
    'DELETE FROM Comments WHERE id = ?',
    [commentId]
  );
  return result;
};

const getCommentById = async (commentId) => {
  const [rows] = await db.query(
    'SELECT * FROM Comments WHERE id = ?',
    [commentId]
  );
  return rows[0];
};

module.exports = {
  getCommentsByPostId,
  getTotalCommentsCount,
  createComment,
  updateComment,
  deleteComment,
  getCommentById,
};
