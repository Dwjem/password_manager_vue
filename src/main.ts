import { createApp } from 'vue'
import { createPinia } from 'pinia'
import Antd from 'ant-design-vue';
import 'ant-design-vue/dist/reset.css';
import "@/assets/font/iconfont.css"
import "//at.alicdn.com/t/c/font_4262358_tx308o415h8.js"

import randomText from './utils/randomText';
import router from './router'
import App from './App.vue'

import container from "./components/container/container.vue"

const pinia = createPinia()
const app = createApp(App);

app.config.globalProperties.$randomText = randomText;

app.use(router);
app.use(pinia);
app.use(Antd);
app.component("container", container)
app.mount('#app')
