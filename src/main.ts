import '@/assets/tailwind.scss';
import {ipcRenderer} from 'electron';
import {createApp} from 'vue';
import router from '@/router';
import events from '@/events';
import App from '@/App.vue';
import {createPinia} from 'pinia';
import {useStepStore} from '@/stores/steps';
import {usePresetStore} from '@/stores/preset';

createApp(App, {
    router,
})
    .use(router)
    .use(createPinia())
    .mount('#app');

const presetStore = usePresetStore();
const stepStore = useStepStore();

if (presetStore.presets.length === 0) {
    presetStore.setupDefault();
}

stepStore.pruneSteps();

ipcRenderer.addListener('open-settings', () => {
    events.emit('showSettings');
});