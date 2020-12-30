import {createApp} from 'vue';
import App from './App.vue';
import 'tailwindcss/tailwind.css';
import {key, store} from './store';

createApp(App)
    .use(store, key)
    .mount('#app');