<template>
  <div class="home container">
    <encrypt></encrypt>
  </div>
</template>

<script>
// @ is an alias to /src
import Encrypt from '@/components/Encrypt.vue'

export default {
  name: 'home',
  data: function() {
    return {
      fullLink: ''
    }
  },

  components: {
    Encrypt
  },

  created() {
    Event.listen('broadcastLink', fullLink => this.fullLink = fullLink);
  },

  methods: {
    
  }
}
</script>
