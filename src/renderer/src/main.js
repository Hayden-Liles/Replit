import 'splitpanes/dist/splitpanes.css';
import '@mdi/font/css/materialdesignicons.css'
import '@xterm/xterm/css/xterm.css'
import './assets/main.scss'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router/router'


createApp(App).use(router).mount('#app')
