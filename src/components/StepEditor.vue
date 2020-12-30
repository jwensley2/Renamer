<template>
    <form>
        <h1 class="text-2xl">Edit Step</h1>

        <div class="my-2">
            <label>Type</label>
            <select v-model="step.transformation" class="text-input">
                <option v-for="type in TransformationTypes" :key="type" :value="type">{{ transformationLabel(type) }}</option>
            </select>
        </div>

        <div class="my-2">
            <label for="step-label">Step Name</label>
            <input
                id="step-label"
                v-model="step.label"
                class="text-input"
                type="text"
            >
        </div>

        <template v-if="step.transformation === TransformationTypes.ChangeCase">
            <div class="my-2">
                <label>Change Case To</label>
                <select v-model="step.options.case" class="text-input">
                    <option v-for="textCase in Case" :key="textCase" :value="textCase">{{ caseLabel(textCase) }}</option>
                </select>
            </div>
        </template>
        <template v-else-if="step.transformation === TransformationTypes.Replace">
            <replace-options v-model="step.options"></replace-options>
        </template>
        <template v-else-if="step.transformation === TransformationTypes.ReplaceList">
            <replace-list-options v-model="step.options"></replace-list-options>
        </template>

        <div class="flex flex-1 justify-between mt-10">
            <button
                class="btn btn-primary w-full mr-3"
                @click.prevent="save"
            >Save
            </button>
            <button
                class="btn btn-warning w-full mr-3"
                @click.prevent="close"
            >Cancel
            </button>

            <button
                class="btn btn-danger w-full"
                @click.prevent="deleteStep"
            >Delete Step
            </button>
        </div>
    </form>
</template>

<script lang="ts">
import {label as transformationLabel, TransformationTypes} from '@/transformations/transformation';
import {defineComponent, reactive} from 'vue';
import _ from 'lodash';
import {Case, caseLabel} from '@/transformations/change-case';
import ReplaceListOptions from '@/components/ReplaceListOptions.vue';
import ReplaceOptions from '@/components/ReplaceOptions.vue';

export default defineComponent({
    name: 'StepEditor',
    components: {ReplaceOptions, ReplaceListOptions},
    props: {
        modelValue: null,
    },
    emits: [
        'update:modelValue',
        'close',
        'delete',
    ],
    setup(props, {emit}): Record<string, unknown> {
        const step = reactive(_.cloneDeep(props.modelValue));

        return {
            step: step,
            TransformationTypes: TransformationTypes,
            transformationLabel: transformationLabel,
            Case: Case,
            caseLabel: caseLabel,
            save: () => {
                emit('update:modelValue', step);
                emit('close');
            },
            close: () => {
                emit('close');
            },
            deleteStep: () => {
                emit('delete', step);
            },
        };
    },
});
</script>

<style scoped>
</style>