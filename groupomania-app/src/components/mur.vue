<template>
  <div>

    <div class='header' id='header'>
      <img alt="Vue logo" src="../assets/groupomania-min.png">
      <h1> Bienvenue sur votre réseau social {{name}} ! </h1>
      <!-- bouton de déconnexion -->
      <button v-on:click.prevent='logout()' type="button" class="btn btn-secondary m-3 " > Se déconnecter !</button>
      <!-- bouton de suppression de compte -->
      <button v-on:click.prevent='deleteCount(userId)' type='button' class='btn btn-danger m-3'> supprimer votre compte !</button>
    </div>

    <!-- Creation d'un nouveau post -->
    <div class='newPost' id='newP'>
      <form method="POST" ENCTYPE="multipart/form-data">
        <div class="form-group ">
          <input v-model='title' type='title' placeholder="Le titre de votre post !" size="50" required aria-label="Titre du post "> <br>
        </div>
        <div class="form-group ">
          <input v-model='content' type='text' placeholder="Dites nous tout !" size="50" required aria-label="Contenu du post"> <br>
        </div>
        <div>
          <div v-if="media">
            <img :src="media" alt="Image du post" class="file">
          </div>
          <div class="form-group ">
            <div class="form-group ">
              <input type="file" accept=".jpeg, .jpg, .png, .webp, .gif" v-on:change="uploadFile" id="file" class="input-file" name='image' aria-label="Image du post">
            </div>
          </div>  
        </div> 
        
          <button v-on:click='newPost()' type="button" class="btn btn-secondary" id='login'>Partager votre post !</button>
        
      </form>

    </div>

  
    <!-- Afficher tous les posts avec les images -->
    <div class='posts' id='posts'>
      <h2>Voici les derniers posts de notre communauté :</h2>
      <!-- les posts -->
      <div class="posted">
        <div id="postdiv" class="post" v-for="post in posts" :key="post.id">
          <h3 class="pt-3 mb-0">{{ post.title }}</h3>
          <small class="text-start pe-0 text-secondary" >publié par <span class="fw-bold">{{ post.userId }}</span></small>
          <p class="pt-3 mb-1">{{ post.content }}</p>
          <p>{{post.id}}</p>
          <div class="form-group">
            <img :src=" 'http://localhost:3000/images/' + post.media " alt= "image du post " />
          </div>
          <!-- bouton supprimer le post -->
          <button v-on:click.prevent='deletePost(post.id)' v-if="post.userId == userId || isAdmin == true" class="btn btn-danger"> Supprimer </button>
          <!-- les commentaires -->
          <button @click ="showComment(comment.postId)" type="button" class="btn btn-warning btn-sm"> Voir les commentaires </button>
          <div v-show ='showComment' id='show_comment'>
            <div id="commentdiv" class="comment" v-if="comment.postId == post.id">
              <p class="content">{{comment.content}}</p>
              <p class="date">{{comment.createdAt}}</p>
            </div>
            <!-- répondre au post -->
            <form>
              <input type="text" id="comment" name="comment" placeholder="Laisse ton commentaire !" >
              <button type="submit" id="btn_comment" class="btnLogin btn-primary btn-sm"> Envoyer ma réponse !</button>
            </form>
          </div>
          
          

        </div>
      </div>
      <!-- fin les posts -->
    </div>

  </div>

</template>


<script>
import axios from 'axios'

export default {
  name:'mur',
  img:'',
  data() {
    return {
      name:'',
      data:JSON.parse(this.$localStorage.get('user')),
      userId: JSON.parse(this.$localStorage.get('userId')),
      isAdmin:JSON.parse(this.$localStorage.get('isAdmin')), 
      posts:[],
           title:'',
           content:'',
           dateAdd:'',
           id:'',
           media:'',
      post:'',
      comments:[],
      comment:'',
      

      
    }
      
  },
  mounted() {
    if (localStorage.name) {
      this.name = localStorage.name;
    }
    // posts
    axios.get('http://localhost:3000/api/posts/getAll',
     {
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
          "Authorization": 'Bearer ' + this.token
        }
      }) 
      .then(res => { 
        console.log(res.data)
        this.posts = res.data
        })
      .catch(error => console.log(error));
    
  },
  created() {
     
  },
  watch: {
    username(newName) {
      localStorage.name = newName;
      }

    
  },
  methods: {
    // déconnexion
    logout: function () {
      localStorage.removeItem('token');
      localStorage.removeItem('userId');
      localStorage.removeItem('name');
      localStorage.removeItem('isAdmin');
      this.$router.push('/');
      },
    // supprimer un compte utilisateur
    deleteCount: function (userId) {
      axios.delete(`http://localhost:3000/api/users/${userId}`,
      {
          headers: {
            'content-type': 'application/json',
            'Authorization': 'Bearer ' + this.token
          }
        })
        .then(() =>{
          localStorage.clear();
          this.$router.push('/');
          alert('Votre compte a été supprimé !')
        })
        .catch(error => console.log(error))
    },
    // supprimer un post
    deletePost: function (id) {
          axios.delete(`http://localhost:3000/api/posts/${id}`,
          {
          headers: {
            'content-type': 'application/json',
            "Accept": "application/json",
            'Authorization': 'Bearer ' + this.token
          }
        } )
          .then(response => {
              console.log(response.data)
              alert('Votre message a été supprimé !')
              location.reload(true);
            })
            .catch(error => console.log(error));
    },
    // les commentaires
    showComment: function(id) {
        let show_comment = document.getElementById('show_comment');
        if(getComputedStyle(show_comment).display != "none"){
        show_comment.style.display = "none"
        } else {
            show_comment.style.display = "block"
            axios.get(`http://localhost:3000/api/comments/getOne/${id}`)
            .then(response => {
              console.log(response.data)
              this.comments =response.data
            })
            .catch(error => console.log(error));
      }
      },
    // creation nouveau post
    newPost: function () {
        const post = {
          title: this.title,
          content: this.content,
          // nom fichier url
          media: this.img,
          // media: this.media,
          userId: this.userId,
          
        }
        var formData = new FormData()
        formData.append('media', this.img)
        // formData.append('media', this.media);
        formData.append('post', JSON.stringify(post));
        axios.post('http://localhost:3000/api/posts/new',
        formData ,{
                  headers: {
                    
                  'Authorization': 'Bearer ' + this.token
                  }
         }
        ).then(() => { 
                  console.log('post envoyé !')
                  console.log( post )
                  this.post ==="";
                  alert('Votre message a bien été envoyé !')
                  location.reload(true);
                })
                .catch((error) => {
                    console.log(error);
                    console.log("Votre message n'a pas pu etre posté !");
                });
        
        
    },
    uploadFile(e) {
      // this.img = e.target.files[0];
       this.img = e.target.files[0];
       const file = e.target.files[0];

       if (file) {
            let reader = new FileReader();
            reader.addEventListener('load', function(){
                let preview = document.getElementById('file');
                preview.setAttribute("src",this.result);
            })
            reader.onload = (event) => {
                this.preview = event.target.result
                this.media = event.target.result
            }
            reader.readAsDataURL(file)
                     
                  
         }
      },
    
  }
}



</script>

<style scoped lang="scss">
.header{
  padding-bottom: 20px;
  margin-bottom: 40px;
  border-bottom: 4mm ridge rgba(220, 50, 53, 0.737);
}
.newPost{
  padding-bottom: 20px;
  margin-bottom: 40px;
  border-bottom: 4mm ridge rgba(220, 50, 53, 0.737);
}
.post{
  border: solid;
  width: 80%;
  margin-top: 20px;
  margin-bottom: 20px;
  margin-left: 10%;
}
img{
  width: 60%;
  height: 40%;
}

#show_comment{
  display: none;
}


</style>