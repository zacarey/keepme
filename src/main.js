import Vue from 'vue'
import App from './App.vue'
import router from './router'

Vue.config.productionTip = false

window.Event = new class {
  constructor() {
    this.vue = new Vue();
  }

  fire(event, data=null) {
    this.vue.$emit(event, data);
  }

  listen(event, callback) {
    this.vue.$on(event, callback);
  }
}

// router.afterEach((to) => {
//   gtag('config', 'UA-146148867-1', {
//     page_path: to.fullPath,
//     app_name: 'KeepMe',
//     send_page_view: true,
//   });
// });

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')

