<template>
    <div>
        <div class="my-2">
            <label for="step-search">Search</label>
            <input id="step-search" v-model="options.search" class="text-input" type="text">
        </div>

        <div class="my-2">
            <label for="step-replace">Replace</label>
            <input id="step-replace" v-model="options.replace" class="text-input" type="text">
        </div>

        <div class="my-2">
            <div class="mt-4">
                <input v-model="options.regex" class="mr-1" type="checkbox">
                <label>Regex</label>
            </div>
        </div>

        <div class="my-2">
            <div v-if="options.regex">
                <input v-model="options.caseInsensitive" class="mr-1" type="checkbox">
                <label>Case Insensitive</label>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import {defineComponent, reactive, watch} from 'vue';
import _ from 'lodash';

export default defineComponent({
    name: 'ReplaceOptions',
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
        };
    },
});
</script>

<style scoped>

</style>