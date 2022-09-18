import '@/assets/tailwind.scss';
import {ipcRenderer} from 'electron';
import {createApp} from 'vue';
import {key, store} from '@/store';
import router from '@/router';
import events from '@/events';
import {Theme} from '@/theme';
import App from '@/App.vue';

if (store.state.presets.length === 0) {
    store.dispatch('setupDefault');
}

createApp(App, {
    router,
})
    .use(router)
    .use(store, key)
    .mount('#app');

store.dispatch('pruneSteps');

// Listen for set theme events from the menu
ipcRenderer.addListener('set-theme', (event, args) => {
    store.commit('setTheme', args as Theme);
});

ipcRenderer.addListener('open-settings', () => {
    events.emit('showSettings');
});