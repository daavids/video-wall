import Vue3Storage from 'vue3-storage';
import { createApp } from 'vue';
import App from './vue/App.vue';

const app = createApp(App);
app.use(Vue3Storage);
app.mount('#app');