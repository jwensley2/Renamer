<template>
    <div>
        <div class="my-2">
            <label for="step-search">Template</label>
            <input id="step-search" v-model="options.template" class="text-input" type="text">
        </div>

        <div>
            <h3>Template Variables</h3>
            <p class="text-sm text-gray-500 mt-1 mb-3">Click a variable to insert it into the template</p>

            <button
                v-for="variable in templateVars"
                :key="variable"
                class="inline-block mr-2 border px-2 py-1 mb-2 text-blue-500"
                @click.prevent="insertVar(variable)"
            >
                {{ variable }}
            </button>
        </div>
    </div>
</template>

<script lang="ts">
import {defineComponent, reactive, watch} from 'vue';
import {Rename} from '@/transformers/rename';
import _ from 'lodash';

export default defineComponent({
    name: 'RenameOptions',
    props: {
        modelValue: null,
    },
    setup(props, {emit}) {
        const options = reactive(_.cloneDeep(props.modelValue));

        watch(options, (newValue) => {
            emit('update:modelValue', newValue);
        }, {deep: true});

        return {
            options: options,
            templateVars: Rename.getTemplateVariables(),
            insertVar(variable: string) {
                options.template += `\${ ${variable} }`;
            },
        };
    },
});
</script>

<style scoped>

</style>