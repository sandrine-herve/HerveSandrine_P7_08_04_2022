<template>
  <div class='header' id='header'>
    <h1> Bienvenue sur votre réseau social {{name}} ! </h1>
<!-- bouton de déconnexion -->
    <button v-on:click.prevent='logout()' type="button" class="btn btn-secondary " > Se déconnecter !</button>
<!-- bouton de suppression de compte -->
    <button v-on:click.prevent='deleteCount(userId)' type='button' class='btn btn-danger'> supprimer votre compte !</button>
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
      
    } 
  },
  mounted() {
    if (localStorage.name) {
      this.name = localStorage.name;
    }
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


</style>