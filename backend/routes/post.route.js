const express = require('express');
const post = require('../controllers/post');
const multer =  require('../middleware/multer-config');
const auth = require('../middleware/auth.js');

const router = express.Router();

    //Posts routes
    router.post('/new', multer, post.createPost);
    router.get('/getOne', multer, post.getOnePost);
    router.get('/getAll', multer, post.getAllPost);
    router.delete('/:id', multer, post.deletePost);
    // router.put('/update',multer, post.updatePost);


module.exports = router;