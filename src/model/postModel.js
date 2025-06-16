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
    } else {
      sql.query(`UPDATE Users SET posts = posts + 1 WHERE id=?`, [post.userId], (errUser, resUser) => {
        if (errUser) {
          console.log('error occured in Posts.create: ', err);
          result (errUser, null);
        } else
          result(null, {id: res.insertId, ...post});
      })
    }
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
  sql.query(`SELECT Posts.*, Users.username  FROM Posts JOIN Users ON Users.id=userId WHERE Posts.id=?`, [postId], (err, res) => {
    if (err) {
      console.log('error ocured in Posts.findById: ', err);
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

Post.getPosts = (page = 1, limit = 10, result) => {
  const offset = (page - 1) * limit;
  sql.query(
    'SELECT p.id, p.title, p.createdAt, p.updatedAt, u.username, p.comments FROM Posts p JOIN Users u ON p.userId = u.id ORDER BY p.createdAt DESC LIMIT ? OFFSET ?',
    [limit, offset],
    (err, rows) => {
      if (err) { 
        console.log('error occured in Post.getPosts', err);
        result(err, null);
      } else {
        result(null, rows);
      }
    }
  );
}

Post.getTotalPostCount = result => {
  sql.query('SELECT COUNT(*) as count FROM Posts', (err, rows) => {
    if (err) {
      console.log('error occured in Post.getTotalPostCount', err);
      result(err, null);
    } else {
      result(null, rows[0].count);
    }
  });
}

module.exports = Post;