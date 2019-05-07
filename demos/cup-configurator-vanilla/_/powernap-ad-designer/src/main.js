import Vue from 'vue'
import App from './App.vue'

var WebFont = require('webfontloader')
WebFont.load({
  google: {
    families: [
      'Abril FatFace',
      'Archivo',
      'Arvo',
      'Concert One',
      'Exo 2',
      'Lato',
      'Lena',
      'Lora',
      'Merriweather',
      'Montserrat',
      'Noto Sans',
      'Nunito',
      'Oswald',
      'Pacifico',
      'Playfair Display',
      'Raleway',
      'Roboto',
      'Sarina',
      'Spectral',
    ]
  }
})

Vue.config.productionTip = false

new Vue({
  render: h => h(App)
}).$mount('#app')
