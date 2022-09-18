import {createRouter, createWebHistory} from 'vue-router';
import {store} from '@/store';
import Home from '@/views/HomeView.vue';
import Preset from '@/views/PresetView.vue';
import Files from '@/components/FileList.vue';
import PresetEditor from '@/components/PresetEditor.vue';
import StepEditor from '@/components/StepEditor.vue';

export default createRouter({
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
            props: (route) => {
                return {
                    preset: store.getters.getPreset(route.params.presetId),
                };
            },
            children: [
                {
                    name: 'files',
                    path: '/preset/:presetId/files',
                    component: Files,
                    props: (route) => {
                        return {
                            preset: store.getters.getPreset(route.params.presetId),
                        };
                    },
                },
                {
                    name: 'edit',
                    path: '/preset/:presetId/edit',
                    component: PresetEditor,
                    props: (route) => {
                        return {
                            modelValue: store.getters.getPreset(route.params.presetId),
                        };
                    },
                },
                {
                    name: 'step',
                    path: 'step/:stepId/edit',
                    component: StepEditor,
                    props: (route) => {
                        return {
                            modelValue: store.getters.getStep(route.params.stepId),
                        };
                    },
                },
            ],
        },
    ],
});