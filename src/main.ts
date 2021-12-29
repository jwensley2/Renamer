import {createApp} from 'vue';
import {createRouter, createWebHistory} from 'vue-router';
import App from './App.vue';
import 'tailwindcss/tailwind.css';
import {key, store} from './store';
import Files from '@/components/Files.vue';
import PresetEditor from '@/components/PresetEditor.vue';
import StepEditor from '@/components/StepEditor.vue';
import Preset from '@/components/Preset.vue';
import Home from '@/components/Home.vue';

const router = createRouter({
    history: createWebHistory(),
    routes: [
        {
            name: 'home',
            path: '/',
            component: Home,
        },
        {
            name: 'preset',
            path: '/preset/:presetId',
            component: Preset,
            props: true,
            children: [
                {
                    name: 'files',
                    path: '/preset/:presetId/files',
                    component: Files,
                    props: true,
                },
                {
                    name: 'edit',
                    path: '/preset/:presetId/edit',
                    component: PresetEditor,
                    props: true,
                },
                {
                    name: 'step',
                    path: 'step/:stepId/edit',
                    component: StepEditor,
                    props: true,
                },
            ],
        },
    ],
});

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