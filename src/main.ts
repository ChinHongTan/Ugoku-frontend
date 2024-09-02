import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'

import FontAwesomeIcon from '@/utils/fontawesome-icon'

const app = createApp(App)

app.component('font-awesome-icon', FontAwesomeIcon)

app.use(router)
app.use(createPinia())

app.mount('#app')
