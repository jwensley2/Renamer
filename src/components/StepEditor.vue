<template>
    <form>
        <h1 class="text-2xl">Edit Step</h1>

        <div class="my-2">
            <label>Type</label>
            <select v-model="step.transformer" class="text-input" @change="transformerChanged">
                <option v-for="type in TransformerType" :key="type" :value="type">{{ transformerLabel(type) }}</option>
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

        <template v-if="step.transformer === TransformerType.ChangeCase">
            <div class="my-2">
                <label>
                    Part
                    <select v-model="step.options.part" class="text-input">
                        <option v-for="part in Part" :key="part" :value="part">{{ part }}</option>
                    </select>
                </label>
            </div>

            <div class="my-2">
                <label>
                    Change Case To
                    <select v-model="step.options.case" class="text-input">
                        <option v-for="textCase in Case" :key="textCase" :value="textCase">{{ caseLabel(textCase) }}</option>
                    </select>
                </label>
            </div>
        </template>
        <template v-else-if="step.transformer === TransformerType.Replace">
            <replace-options v-model="step.options"></replace-options>
        </template>
        <template v-else-if="step.transformer === TransformerType.ReplaceList">
            <replace-list-options v-model="step.options"></replace-list-options>
        </template>
        <template v-else-if="step.transformer === TransformerType.Trim">
            <div class="my-2">
                <label for="trim-characters">Characters</label>
                <input
                    id="trim-characters"
                    v-model="step.options.characters"
                    class="text-input"
                    type="text"
                >
            </div>
        </template>
        <template v-else-if="step.transformer === TransformerType.Rename">
            <rename-options v-model="step.options"></rename-options>
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
import {label as transformerLabel, TransformerType} from '@/transformers/transformer';
import {computed, defineComponent, reactive} from 'vue';
import _ from 'lodash';
import {Case, caseLabel} from '@/transformers/change-case';
import {Part} from '@/file';
import Step from '@/step';
import ReplaceListOptions from '@/components/ReplaceListOptions.vue';
import ReplaceOptions from '@/components/ReplaceOptions.vue';
import RenameOptions from '@/components/RenameOptions.vue';

export default defineComponent({
    name: 'StepEditor',
    components: {RenameOptions, ReplaceOptions, ReplaceListOptions},
    props: {
        modelValue: null,
    },
    emits: [
        'update:modelValue',
        'close',
        'delete',
    ],
    setup(props, {emit}): Record<string, unknown> {
        const step = reactive(_.cloneDeep(props.modelValue)) as Step;

        return {
            step: step,
            TransformerType: TransformerType,
            transformerLabel: transformerLabel,
            Case: Case,
            Part: computed(() => {
                return _.filter(Part, (part) => typeof (part) === 'string');
            }),
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
            transformerChanged: () => {
                step.options = step.mergeOptionsWithDefaults(step.options);
            },
        };
    },
});
</script>

<style scoped>
</style>