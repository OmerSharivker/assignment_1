
const express = require('express');
const commentsControllers = require('../controllers/commentsControllers');
const router = express.Router();


router.post('/comment',commentsControllers.postComment);
router.get('/comment/:commentId',commentsControllers.readComment);
router.put('/comment/:commentId',commentsControllers.updateComment);
router.delete('/comment/:commentId',commentsControllers.deleteComment);
router.get('/comment/get-all-comments/:postId',commentsControllers.getComments);

module.exports = router;