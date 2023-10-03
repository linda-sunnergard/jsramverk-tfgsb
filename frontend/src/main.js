import './assets/style.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

if (location.host === "localhost:5173") {
    import.meta.env.VITE_BACKEND = "http://localhost:1337";
}

const app = createApp(App)

app.use(createPinia())
app.use(router)

app.mount('#app')
