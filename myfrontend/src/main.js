import Vue from 'vue'
import App from './App.vue'
import router from './router'
import 'bulma/css/bulma.css'
import Vuelidate from 'vuelidate'

Vue.use(Vuelidate)

Vue.config.productionTip = false

new Vue({
  router,  // add router here
  render: h => h(App),
}).$mount('#app')