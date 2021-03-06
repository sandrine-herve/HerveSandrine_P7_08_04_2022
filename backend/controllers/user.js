const bcrypt = require('bcrypt'); //création d'un mot de passe hashé.

const models = require('../models');

const jwtUtils = require('../middleware/auth');


const EMAIL_REGEX = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
const PASSWORD_REGEX = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{4,20}$/;

module.exports = {
    //save user.
    signup: function(req, res) {
        //params
        const name = req.body.name;
        const email = req.body.email;
        const password = req.body.password;

        console.log(req.body)

        if (name == null || email == null || password == null ) {
            return res.status(400).json({'error': 'missing parameters'});
        }

        if (name.length >= 13 || name.length <= 2) {
          return res.status(400).json({ 'error': 'wrong name (must be length 2 - 12)'});
        }

        if (!EMAIL_REGEX.test(email)){
          return res.status(400).json({'error': 'email is not valid !'});
        }

        if (!PASSWORD_REGEX.test(password)){
          return res.status(400).json({ 'error': ' Password must be at least 4 characters, no more than 8 characters, and must include at least one upper case letter, one lower case letter, and one numeric digit.'})
        }

        models.User.findOne({
            attributes: ['email'],
            where: { email: email }
        })
        .then(function(userFound){
          if(!userFound) {
            
            bcrypt.hash(password, 10, function( err, bcryptedPassword ) {
              const newUser = models.User.create({
                  name: name,
                  email: email,
                  password: bcryptedPassword,
                  isAdmin: 0,
              })
              .then(function(newUser) {
                  return res.status(201).json({'userId': newUser.id })
              })
              .catch(function(err) {
                  return res.status(500).json({ 'error': 'cannot add user'});
              });
            });

          } else {
              return res.status(409).json({ 'error': 'user already exist' });
          }
        })
        .catch(function(err) {
          return res.status(500).json({ 'error':'unable to verify user' });
        });

    },
    //Connexion user.
    login: function(req, res) {

      //params.
      const email = req.body.email;
      const password = req.body.password;

      if (email == null || password == null) {
        return res.status(400).json({ 'error': 'missing parameters'});
      }

      models.User.findOne({
        where: { email: email }
      })
      .then(function(userFound) {
        if (userFound) {
          bcrypt.compare(password, userFound.password, function(errBycrypt, resBycrypt) {
            if(resBycrypt) {
              return res.status(200).json({
                'userId': userFound.id,
                'token': jwtUtils.generateTokenForUser(userFound),
                'name': userFound.name,
                'isAdmin': userFound.isAdmin,
              });
            } else {
              return res.status(403).json({ 'error': 'invalid password'});
            }
          });
        } else {
          return res.status(404).json({ 'error': 'user not exist in DB'});
        }
      })
      .catch(function(err) {
        return res.status(500).json({ 'error': 'unable to verify user'});
      });
    },

    // voir un profil.
    getUserProfile: function(req, res) {
      models.User.findOne({
        attributes: ["name","email"],
        where: { id: req.body.id},
      })
      .then((user) => {
        if (user) {
          res.status(200).json(user);
        } else{
          res.status(404).json({ error: 'Utilisateur non trouvé !'})
        }
      })
      .catch((error) =>{
        res.status(500).json({ error: 'Impossible de voir le profil !'})
      });

    },

    //supprimer un user.
     deleteUser: function(req, res ) {
      const headerAuth = req.headers['authorization'];
      const userId = jwtUtils.getUserId(headerAuth);

        models.User.findOne({
            where: {id: req.params.userId},
        })
      
        .then( (user) => {
            user.destroy()
            .then(()=> { res.status(200).json({ message: "utilisateur supprimé !"})})
            .catch((error)=> { res.status(400).json({ error: error, message:"L'utilisateur n'a pas pu être supprimé !"})})
        }
        )
        .catch((error) => {res.status(400).json({ error: error, message: "Une erreur est survenue" })});
      
    },
    
    //     const headerAuth = req.headers['authorization'];
    //     const userId = jwtUtils.getUserId(headerAuth);
    
    //     try{
    //         const user = models.User.findOne({ where: {id: req.body.userId}})
    
    //         if (userId === user.id || isAdmin === true){
    //             if (user.profilePhoto !== null){
    //                 const filename = user.profilePhoto.split('/images/')[1];
    //                 fs.unlink(`images/${filename}`, () => {
    //                     user.destroy({
    //                         where: {id: req.body.userId}
    //                     })
    //                     return res.json({ message: 'Profile removed'})
    //                 })
    //             } else {
    //                 user.destroy({
    //                     where: {id: req.body.userId}
    //                 })
    //                 return res.json({ message: 'Profile removed'})
    //             }
    //         }else {
    //             res.status(404).json({ 'error': 'Unable to verify user' });
    //         }
    //     }catch (err) {
    //         return res.status(500).json({err})
    //     }
    // },

    //Déconnexion.
    logout: function (req, res) {
      res.cookie('jwt', '', { maxAge: 1 });
      res.redirect('/');
      
    }

};
