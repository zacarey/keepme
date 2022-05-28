<template>
  <div class="unlock">
    <div v-if="this.$route.query.k">
      <decrypt></decrypt>
    </div>
    <div v-else>
      <img style="border: 0" width="175" height="175" alt="Vue logo" src="https://img.freepik.com/free-vector/illustration-of-lock-icon_53876-5633.jpg?size=338&ext=jpg">
      <p>No KeepMe Found!!!</p>
    </div>
  </div>
</template>

<script>
// @ is an alias to /src
import Decrypt from '@/components/Decrypt.vue'

export default {
  name: 'unlock',
  methods: {
    getUrl() {
      this.url = this.$route.query.fullPath + ' .';
      var currentUrl = window.location.pathname;
      console.log(currentUrl);
    }
  },
  components: {
    Decrypt
  },
}
</script>
