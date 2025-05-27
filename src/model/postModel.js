const sql = require('../config/db');

const Post = function(post) {
  this.title = post.title;
  this.content = post.content;
  this.userId = post.userId;
};

Post.create = (post, result) => {
  sql.query(`INSERT INTO Posts (title, content, createdAt, updatedAt, userId) VALUES (?, ?, NOW(), NOW(), ?)`
    , [post.title, post.content, post.userId]
    , (err, res) => {
      if (err) {
      console.log('error ocured in Posts.create: ', err);
      result(err, null);
    } else
      result(null, {id: res.insertId, ...post});
  });
}

Post.updatePost = (post, result) => {
  sql.query(`UPDATE Posts SET title=?, content=? WHERE id=?`
    , [post.title, post.content, post.id]
    , (err, res) => {
      if (err) {
        console.log('error ocured in Posts.updatePost: ', err);
        result(err, null);
      } else
        result(null, {...post});
    }
  )
}

Post.findById = (postId, result) => {
  sql.query(`SELECT * FROM Posts WHERE id=?`, [postId], (err, res) => {
    if (err) {
      console.log('error ocured in Posts.getAll: ', err);
      result(err, null);
    } else
      result(null, res[0]);
  })
}

Post.getAll = result => {
  sql.query('SELECT * FROM Posts', (err, res) => {
    if (err) {
      console.log('error ocured in Posts.getAll: ', err);
      result(err, null);
    } else
      result(null, res);
  })
}

Post.delete = (postId, result) => {
  sql.query('DELETE FROM Posts WHERE id=?', [postId], (err, res) => {
    if (err) {
      console.log('error occured in Post.delete', err);
      result(err, null);
    } else {
      result(null, res);
    }
  })
}

module.exports = Post;