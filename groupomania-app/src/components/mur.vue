<template>
  <div>

    <div class='header' id='header'>
      <h1> Bienvenue sur votre réseau social {{name}} ! </h1>
      <!-- bouton de déconnexion -->
      <button v-on:click.prevent='logout()' type="button" class="btn btn-secondary " > Se déconnecter !</button>
      <!-- bouton de suppression de compte -->
      <button v-on:click.prevent='deleteCount(userId)' type='button' class='btn btn-danger'> supprimer votre compte !</button>
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
          <div class="form-group">
            <img :src=" 'http://localhost:3000/images/' + post.media " alt= "image du post " />
          </div>
          <!-- bouton supprimer le post -->
          <button v-if="post.userId == userId || isAdmin == true" v-on:click.prevent="deletePost()" class="btn btn-danger"> Supprimer </button>
          
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
  data() {
    return {
      name:'',
      userId: JSON.parse(this.$localStorage.get('userId')),
      isAdmin:JSON.parse(this.$localStorage.get('isAdmin')), 
      posts:[],
           title:'',
           content:'',
           dateAdd:'',
           id:'',
           media:'',
      post:'',
    } 
  },
  mounted() {
    if (localStorage.name) {
      this.name = localStorage.name;
    }

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
      
      console.log(userId) 
       console.log(post.userId)
       console.log(isAdmin)

    
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
      let token = localStorage.getItem('token');
      axios.delete(`http://localhost:3000/api/users/${userId}`,
      {
          headers: {
            'content-type': 'application/json',
            'Authorization': 'Bearer ' + token
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
    deletePost: function() {
          axios.delete('http://localhost:3000/api/posts/delete' )
          .then(response => {
              console.log(response.data)
              this.comments =response.data
            })
            .catch(error => console.log(error));
       },
  },

}


</script>

<style scoped lang="scss">
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


</style>

// todolist: <p> a revoir!