const sql = require('./db.js');

const Post = function(post) {
  this.title = post.title;
  this.content = post.content;
  this.userId = post.userId;
};

Post.create = (post, result) => {
  sql.query(`INSERT INTO posts (title, content, createdAt, updatedAt, userId) VALUES (?, ?, NOW(), NOW(), ?)`,
    [ post.title, post.content, post.userId ],
    (err, res) => {
      if (err) {
        console.log('error ocured in Posts.create: ', err);
        result(err, null);
      } else
        result(null, {id: res.insertId, ...post});
    });
}

Post.getAll = result => {
  sql.query('SELECT * FROM posts', (err, res) => {
    if (err) {
      console.log('error ocured in Posts.getAll: ', err);
      result(err, null);
    } else
      result(null, res);
  })
}

module.exports = Post;