
const express = require('express');
const commentsControllers = require('../controllers/commentsControllers');
const router = express.Router();


router.post('/comment',commentsControllers.postComment);
router.get('/comment/:commentId',commentsControllers.readComment);
router.put('/comment/:commentId',commentsControllers.updateComment);

module.exports = router;