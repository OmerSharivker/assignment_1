
const express = require('express');
const router = express.Router();
const postController = require("../controllers/postController");

router.get('/posts',postController.getAllPosts)

router.get('/posts/sender',postController.getPostsBySender);

router.post('/posts',postController.savePost)


module.exports = router;