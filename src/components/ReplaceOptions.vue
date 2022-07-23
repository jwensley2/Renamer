<template>
    <div>
        <div class="form-control my-2">
            <label for="step-search" class="label">
                <span class="label-text">Search</span>
            </label>
            <input id="step-search" v-model="options.search" class="input input-bordered" type="text">
        </div>

        <div class="form-control my-2">
            <label for="step-replace" class="label">
                <span class="label-text">Replace</span>
            </label>
            <input id="step-replace" v-model="options.replace" class="input input-bordered" type="text">
        </div>

        <div class="form-control mt-4 mb-2">
            <label class="label justify-start py-0">
                <input v-model="options.regex" class="checkbox checkbox-xs mr-1" type="checkbox">
                <span class="label-text">Regex</span>
            </label>
        </div>

        <div v-if="options.regex" class="my-3 form-control">
            <label class="label justify-start py-0">
                <input v-model="options.caseInsensitive" class="checkbox checkbox-xs mr-1" type="checkbox">
                <span class="label-text">Case Insensitive</span>
            </label>
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