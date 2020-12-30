<template>
    <form>
        <h1 class="text-2xl">Edit Preset</h1>

        <div class="my-2">
            <label for="step-label">Name</label>
            <input
                id="step-label"
                v-model="preset.name"
                class="text-input"
                type="text"
            >
        </div>

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
            >Delete Preset
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
    name: 'PresetEditor',
    props: {
        modelValue: null,
    },
    emits: [
        'update:modelValue',
        'close',
        'delete',
    ],
    setup(props, {emit}) {
        const preset = reactive(_.cloneDeep(props.modelValue));

        return {
            preset: preset,
            save: () => {
                emit('update:modelValue', preset);
                emit('close');
            },
            close: () => {
                emit('close');
            },
            deleteStep: () => {
                emit('delete', preset);
            },
        };
    },
});
</script>

<style scoped>
</style>