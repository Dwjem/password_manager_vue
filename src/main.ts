import {createApp} from 'vue'
import {createPinia} from 'pinia'
import Antd from 'ant-design-vue';
import 'ant-design-vue/dist/reset.css';
import "@/assets/font/iconfont.css"
import "//at.alicdn.com/t/c/font_4262358_tx308o415h8.js"


import {generateRandomText, convertToPinyin} from './utils';
import router from './router'
import App from './App.vue'

import container from "./components/container/container.vue"

const pinia = createPinia()
const app = createApp(App);

app.config.globalProperties.$randomText = generateRandomText;
app.config.globalProperties.$convertToPinyin = convertToPinyin;


app.use(pinia);
app.use(router);
app.use(Antd);
app.component("container", container)
app.mount('#app')
