<template>
    <div class="overflow-y-auto">
        <h2 class="text-lg font-semibold">Renaming Steps</h2>

        <ol id="steps" class="mb-3 whitespace-nowrap">
            <li
                v-for="step in preset.steps"
                :key="step.id"
                :class="{'drop-zone bg-gray-200': step.draggedOver, 'bg-neutral text-neutral-content': isEditing(step)}"
                class="flex items-stretch justify-between border-t first:border-t-0 py-1 px-2 border-neutral"
                draggable="true"
                @dragenter="dragEnter($event, step)"
                @dragleave="dragExit($event, step)"
                @dragstart="startDrag($event, step)"
                @drop="onDrop($event, step)"
                @dragover.prevent
            >
                <span class="text-gray-400 mr-2 cursor-move">::</span>
                <button
                    class="mr-5 flex-1 text-left step-name focus:outline-none"
                    @click="$router.push({name: 'step', params: {stepId: step.id}})"
                >
                    {{ step.label }} <span class="edit invisible text-sm text-gray-500">edit</span>
                </button>
                <input v-model="step.active" class="self-center checkbox checkbox-xs" type="checkbox" @change="changeStepActive(step)">
            </li>
        </ol>

        <button
            class="btn btn-sm btn-primary w-full"
            @click.prevent="addStep"
        >
            Add Step
        </button>
    </div>
</template>

<script lang="ts">
import {defineComponent} from 'vue';
import Step from '@/step';
import {TransformerType} from '@/transformers/transformer';
import {useStore} from '@/store';
import {useRoute, useRouter} from 'vue-router';
import Preset from '@/preset';

export default defineComponent({
    props: {
        preset: {
            type: Preset,
            required: true,
        },
    },
    setup(props) {
        const router = useRouter();
        const store = useStore();

        return {
            addStep: () => {
                const step = new Step('', TransformerType.ChangeCase);

                store.dispatch('addStepForPreset', {preset: props.preset, step: step});

                router.push({name: 'step', params: {stepId: step.id}});
            },
            changeStepActive: (step: Step) => {
                store.commit('setStepActive', {id: step.id, active: step.active});
            },
            startDrag: (evt: DragEvent, step: Step) => {
                if (!evt.dataTransfer) return;

                evt.dataTransfer.dropEffect = 'move';
                evt.dataTransfer.effectAllowed = 'move';
                evt.dataTransfer.setData('stepId', step.id);

            },
            onDrop: (evt: DragEvent, step: Step) => {
                if (!evt.dataTransfer) return;
                const stepId = evt.dataTransfer.getData('stepId');
                const stepIndex = props.preset.steps.findIndex((s: Step) => s.id === step.id);
                const droppedStepIndex = props.preset.steps.findIndex((step: Step) => step.id === stepId);

                if (stepIndex !== droppedStepIndex) {
                    store.dispatch('moveStep', {preset: props.preset, oldIndex: droppedStepIndex, newIndex: stepIndex});
                }

                step.draggedOver = false;
            },
            dragEnter: (evt: DragEvent, step: Step) => {
                step.draggedOver = true;
            },
            dragExit: (evt: DragEvent, step: Step) => {
                step.draggedOver = false;
            },
            isEditing: (step: Step) => {
                return useRoute().name === 'step' && useRoute().params.stepId === step.id;
            },
        };
    },
});
</script>

<style lang="scss" scoped>
.drop-zone * {
    pointer-events: none
}

.step-name:hover .edit {
    visibility: visible;
}
</style>