<template>
    <div class="flex p-2 h-full">
        <div id="sidebar" class="border-r h-full pr-2">
            <presets class="mb-4" @edit-preset="editPreset" @preset-changed="presetChanged"/>
            <steps @edit-step="editStep"/>
        </div>
        <div id="main" class="h-full flex-grow ml-2 overflow-auto max-h-full">
            <preset-editor
                v-if="editingPreset"
                :key="preset.id"
                v-model="preset"
                @close="closePresetEditor"
                @delete="deletePreset"
            />
            <step-editor
                v-else-if="editingStep"
                :key="step.id"
                v-model="step"
                @close="closeStepEditor"
                @delete="deleteStep"
            />
            <files v-else/>
        </div>
    </div>
</template>

<script lang="ts">
import {defineComponent, ref, watch} from 'vue';
import Steps from '@/components/Steps.vue';
import Files from '@/components/Files.vue';
import PresetEditor from '@/components/PresetEditor.vue';
import StepEditor from '@/components/StepEditor.vue';
import Step from '@/step';
import {useStore} from '@/store';
import Preset from '@/preset';
import Presets from '@/components/Presets.vue';

export default defineComponent({
    components: {
        Presets,
        Steps,
        Files,
        PresetEditor,
        StepEditor,
    },

    setup() {
        const store = useStore();

        let editingPreset = ref();
        let isEditingPreset = ref(false);

        let editingStep = ref();
        let isEditingStep = ref(false);

        watch(editingPreset, (newValue) => {
            store.commit('updatePreset', newValue);
        }, {deep: true});

        watch(editingStep, (newValue) => {
            store.commit('updateStep', newValue);
        }, {deep: true});

        return {
            preset: editingPreset,
            editingPreset: isEditingPreset,
            step: editingStep,
            editingStep: isEditingStep,
            editPreset: (preset: Preset) => {
                editingPreset.value = preset;
                isEditingPreset.value = true;
            },
            closePresetEditor: () => {
                isEditingPreset.value = false;
            },
            deletePreset: (preset: Preset) => {
                isEditingPreset.value = false;
                store.commit('deletePreset', preset);
            },
            presetChanged: (preset: Preset) => {
                isEditingStep.value = false;

                if (isEditingPreset.value) {
                    editingPreset.value = preset;
                }
            },
            editStep: (step: Step) => {
                editingStep.value = step;
                isEditingStep.value = true;
            },
            closeStepEditor: () => {
                isEditingStep.value = false;
            },
            deleteStep: (step: Step) => {
                isEditingStep.value = false;
                store.commit('deleteStep', step);
            },
        };
    },
});
</script>

<style lang="scss">
html, body, #app {
    height: 100%;
}

.btn {
    @apply px-4 py-2 mb-2
}

.btn-sm {
    @apply py-1 text-sm;
}

.btn-primary {
    @apply text-white bg-blue-500 hover:bg-blue-400;
}

.btn-warning {
    @apply text-white bg-yellow-500 hover:bg-yellow-400;
}

.btn-danger {
    @apply text-white bg-red-500 hover:bg-red-400;
}

.text-input {
    @apply block border px-2 py-1 rounded w-full
}
</style>