import { createApp } from 'vue';
import App from './App.vue';
import router from './router'; // Importation du routeur

createApp(App)
    .use(router) // Utilisation du routeur
    .mount('#app');
