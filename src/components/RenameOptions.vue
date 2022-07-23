<template>
    <div>
        <div class="form-control my-2">
            <label for="step-search" class="label">
                <span class="label-text">Template</span>
            </label>
            <input id="step-search" v-model="options.template" class="input input-bordered" type="text">
        </div>

        <div>
            <h3>Template Variables</h3>
            <p class="text-sm text-gray-500 mt-1 mb-3">Click a variable to insert it into the template</p>

            <button
                v-for="variable in templateVars"
                :key="variable"
                class="mr-2 btn btn-xs btn-accent mb-2"
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