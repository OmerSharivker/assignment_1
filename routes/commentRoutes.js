
const express = require('express');
const commentsControllers = require('../controllers/commentsControllers');
const router = express.Router();


router.post('/comment',commentsControllers.postComment)


module.exports = router;