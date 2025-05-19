router.get('/detail/:postId', (req, res) => {
const { postId } = req.params;

// TODO: DB에서 postId 게시글 상세 조회 로직
const post = {
id: postId,
title: '첫번째 게시글',
content: '내용입니다.',
author: 'user1',
date: '2025-05-15',
};

return res.status(200).json({
code: 2005,
message: '게시글 상세 조회에 성공했습니다.',
data: post,
});
});