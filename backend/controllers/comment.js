const bcrypt = require('bcrypt'); //création d'un mot de passe hashé.

const User = require('../models/user.model');

const jwt = require('jsonwebtoken'); // création et vérification des tokens d'authentification.

const jwtUtils = require('../middleware/auth');

const models = require('../models')


//Routes
module.exports = {
    createComment: function(req, res) {
        const headerAuth = req.headers['authorization'];
        const userId = jwtUtils.getUserId(headerAuth);

        //Constants
        const TITLE_LIMIT = 2;
        const CONTENT_LIMIT = 4;

         //params.
         const comment = JSON.parse(req.body.comment);
         const content = comment.content;
         const postId = req.params.postId;

         if (content == null) {
            return res.status(400).json({'error': 'missing parameters'});
        }

        models.Comment.create({
            content: content,
            userId: userId,
            postId: postId,
            dateAdd: Date.now()
        })
        .then(result => {
            res.status(201).json({
                message:'Comment created successfully !',
                comment: result,
            
            });
        })
        .catch(error => {
            res.status(500).json({
                message: 'Something went wrong !',
                error: error
            });
        })
    },
    getComments: function (req, res) {
        models.Comment.findAll({
            where: { postId: req.params.postId },
            order: [['id', 'DESC']], 
        }).then(result => {
            res.status(200).json(result);
        }).catch(error => {
            res.status(500).json({
                message: 'Something went wrong'
            });
        });
    },

    getAllComment: function (req, res) {
        models.Comment.findAll({
           order:[[
                'createdAt', 'DESC'
           ]]
            }).then(result => {
            res.status(200).json(result);
        }).catch(error => {
            res.status(400).json({
                message: 'Something went wrong'
            });
        });
    },

    deleteComment: function(req, res) {
        
        models.Comment.findOne({
            where: {id: req.body.id},
        })
        .then( (comment) => {
            comment.destroy()
            .then(()=> { res.status(200).json({ message: "commentaire supprimé !"})})
            .catch((error)=> { res.status(400).json({ error: error, message:"Le commentaire n'a pas pu être supprimé !"})})
        }
        )
        .catch((error) => {res.status(400).json({ error: error, message: "Une erreur est survenue" })});
    },
}