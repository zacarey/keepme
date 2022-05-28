<template>
  <div class="about">
    <br/>
    <p>
      Lock away messages, links, secrets... or even cryptocurrency in
      a unique, encrypted URL that wholly contains your KeepMe.
    </p>
    <p>
      A KeepMe link is never stored or captured
      and is only unlockable by knowing the correct answer. KeepMe isn't 
      supposed to be the best place to store something
      you don't want anyone to know, but a place for it to be discovered.
    </p>
    <p>
      Questions? Comments? <a :href="`mailto:${email}`">talk.keepme@gmail.com</a>
    </p>
    <router-link to="/"><img src="add-lock.png" height = 30 width = 30/></router-link>
  </div>
</template>

<style>
.about {
  padding: 0 20% 0;
}
</style>

<script>
export default {
  name: 'About_view',
  data: function() { 
    return{
      email: 'talk.keepme@gmail.com'
    }
  },

  mounted() {
    gtag('config', 'UA-146148867-1', {
      page_path: '/about',
      app_name: 'KeepMe',
      send_page_view: true,
    });

  }
}
</script>