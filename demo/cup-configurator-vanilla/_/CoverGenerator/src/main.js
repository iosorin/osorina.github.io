import Purecss    from 'purecss'
import Vue        from 'vue'
import { Fabric } from 'vue-fabric'
import vSuggest   from 'v-suggest'

import App from './App.vue'

import 'vue-fabric/dist/vue-fabric.min.css'

Vue.config.productionTip = false
Vue.use(Fabric)
Vue.use(vSuggest)

new Vue({
  render: h => h(App),
  components: {App, Purecss},
}).$mount('#app')
