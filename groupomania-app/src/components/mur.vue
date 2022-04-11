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
        <div id="postdiv" class="post"  v-for="post in posts" :key="post.id">
          <!-- v-for="message in messages.slice().reverse()" :key="message.id" -->
          <div class="col-10 offset-1 bg-light rounded shadow-sm mb-3">
            <h3 class="pt-3 mb-0">{{ post.title }}</h3>
            <small class="text-start pe-0 text-secondary" >publié par <span class="fw-bold">{{ post.userId }}</span></small>
            <p class="pt-3 mb-1">{{ post.content }}</p>
            <div>
              <img :src=" post.media  " alt= "image du post " />
            </div>
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
  data() {
    return {
      name:'',
      userId: JSON.parse(this.$localStorage.get('userId')),
      posts:[],
           title:'',
           content:'',
           dateAdd:'',
           id:'',
           media:'',
      
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
      .then(res => { console.log(res.data)
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
    logout: function () {
      localStorage.removeItem('token');
      localStorage.removeItem('userId');
      localStorage.removeItem('name');
      localStorage.removeItem('isAdmin');
      this.$router.push('/');
      },
    
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
    }
  },

}


</script>

<style scoped lang="scss">
ul {
  list-style-type : none;
}

</style>