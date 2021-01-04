<template>
    <div>
        <h2 class="text-lg font-semibold">Renaming Steps</h2>

        <ol id="steps" class="mb-3 whitespace-nowrap">
            <li
                v-for="step in steps"
                :key="step.id"
                :class="{'drop-zone bg-gray-200': step.draggedOver}"
                class="flex items-stretch justify-between border-t first:border-t-0 py-1"
                draggable="true"
                @dragenter="dragEnter($event, step)"
                @dragleave="dragExit($event, step)"
                @dragstart="startDrag($event, step)"
                @drop="onDrop($event, step)"
                @dragover.prevent
            >
                <span class="text-gray-400 mr-2 cursor-move">::</span>
                <button class="mr-5 flex-1 text-left step-name" @click="$.emit('edit-step', step)">
                    {{ step.label }} <span class="edit invisible text-sm text-gray-500">edit</span>
                </button>
                <input v-model="step.active" class="self-center" type="checkbox" @change="changeStepActive(step)">
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
import {computed, defineComponent} from 'vue';
import Step from '@/step';
import {TransformerType} from '@/transformers/transformer';
import {useStore} from '@/store';

export default defineComponent({
    setup(props, {emit}) {
        const store = useStore();
        const steps = computed(() => store.getters.steps);

        return {
            steps: steps,
            addStep: () => {
                const step = new Step('', TransformerType.ChangeCase);

                store.commit('addStep', step);
                emit('edit-step', step);
            },
            changeStepActive: () => {
                store.commit('savePresets');
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
                const stepIndex = steps.value.findIndex((s: Step) => s.id === step.id);
                const droppedStepIndex = steps.value.findIndex((step: Step) => step.id === stepId);

                if (stepIndex !== droppedStepIndex) {
                    store.commit('moveStep', {oldIndex: droppedStepIndex, newIndex: stepIndex});
                }

                step.draggedOver = false;
            },
            dragEnter: (evt: DragEvent, step: Step) => {
                step.draggedOver = true;
            },
            dragExit: (evt: DragEvent, step: Step) => {
                step.draggedOver = false;
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