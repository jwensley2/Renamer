import {createRouter, createWebHistory} from 'vue-router';
import Home from '@/views/HomeView.vue';
import Preset from '@/views/PresetView.vue';
import Files from '@/components/FileList.vue';
import PresetEditor from '@/components/PresetEditor.vue';
import StepEditor from '@/components/StepEditor.vue';
import {usePresetStore} from '@/stores/preset';
import {useStepStore} from '@/stores/steps';

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
            beforeEnter: (to, from, next) => {
                const presetStore = usePresetStore();
                const preset = presetStore.getPreset(to.params.presetId as string);

                if (!preset) {
                    return next({path: '/'});
                }

                next();
            },
            props: (route) => {
                const presetStore = usePresetStore();
                return {
                    modelValue: presetStore.getPreset(route.params.presetId as string),
                };
            },
            children: [
                {
                    name: 'files',
                    path: '/preset/:presetId/files',
                    component: Files,
                    props: (route) => {
                        const presetStore = usePresetStore();

                        return {
                            preset: presetStore.getPreset(route.params.presetId as string),
                        };
                    },
                },
                {
                    name: 'edit',
                    path: '/preset/:presetId/edit',
                    component: PresetEditor,
                    props: (route) => {
                        const presetStore = usePresetStore();

                        return {
                            modelValue: presetStore.getPreset(route.params.presetId as string),
                        };
                    },
                },
                {
                    name: 'step',
                    path: 'step/:stepId/edit',
                    component: StepEditor,
                    props: (route) => {
                        const stepStore = useStepStore();

                        return {
                            modelValue: stepStore.getStep(route.params.stepId as string),
                        };
                    },
                },
            ],
        },
    ],
});