<template>
  <div class="home">
    <img alt="Vue logo" src="../assets/logo.png">
    <groupomania msg="Welcome to Groupomania ! "/>
    <login/>
  </div>
</template>

<script>
// @ is an alias to /src
import groupomania from '@/components/groupomania.vue'
import login from '@/components/login.vue'




export default {
  name: 'Home',
  components: {
    groupomania,
    login,
    
    
    
  }
}
</script>
<style scoped lang="scss">

img{
  width: 40%;
}
</style>