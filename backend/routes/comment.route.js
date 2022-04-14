const express = require('express');
const router = express.Router();

const comment = require('../controllers/comment.js');

const multer = require('../middleware/multer-config.js');


    //Comments routes
    router.post('/new/:postId', multer, comment.createComment);
    router.get('/getComments/:postId', multer, comment.getComments);
    router.get('/getAll', multer, comment.getAllComment);
    router.delete('/delete/:id', comment.deleteComment );


module.exports = router;