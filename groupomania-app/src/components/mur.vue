<template>
  <div class='header' id='header'>
    <h1> Bienvenue sur votre réseau social {{name}} ! </h1>
<!-- bouton de déconnexion -->
    <button v-on:click.prevent='logout()' type="button" class="btn btn-secondary " > Se déconnecter !</button>
<!-- bouton de suppression de compte -->
    <button v-on:click.prevent='deleteCount()' type='button' class='btn btn-danger'> supprimer votre compte !</button>
  </div>
</template>


<script>
export default {
  name:'mur',
  data() {
    return {
      name:'',
      
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
  },

}


</script>

<style scoped lang="scss">


</style>