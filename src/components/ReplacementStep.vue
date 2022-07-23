<template>
    <div class="flex flex-1 items-center py-2">
        <div class="form-control mr-2 flex-grow">
            <label :for="`step-search-${index}`" class="label hidden">Search</label>
            <input
                :id="`step-search-${index}`"
                v-model="replacement.search"
                class="input input-sm input-bordered"
                placeholder="Search For"
                type="text"
            >
        </div>

        <div class="form-control mr-2 flex-grow">
            <label :for="`step-replace-${index}`" class="label hidden">Replace</label>
            <input
                :id="`step-replace-${index}`"
                v-model="replacement.replace"
                class="input input-sm input-bordered"
                placeholder="Replace With"
                type="text"
            >
        </div>

        <div class="mr-2 whitespace-nowrap items-center text-sm" style="min-width: 150px">
            <div class="form-control mt-0">
                <label class="label py-0 justify-start">
                    <input v-model="replacement.regex" class="checkbox checkbox-xs mr-1" type="checkbox">
                    <span class="label-text">Regex</span>
                </label>
            </div>

            <div class="form-control" v-if="replacement.regex">
                <label class="label py-0 justify-start">
                    <input v-model="replacement.caseInsensitive" class="checkbox checkbox-xs mr-1" type="checkbox">
                    <span class="label-text">Case Insensitive</span>
                </label>
            </div>
        </div>

        <div class="pr-2">
            <button class="text-red-500 text-lg w-4 h-4" @click.prevent="$emit('delete')">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd" />
                    </svg>
                </svg>
            </button>
        </div>
    </div>
</template>

<script lang="ts">
import {defineComponent} from 'vue';

export default defineComponent({
    props: {
        modelValue: null,
    },

    setup(props, {emit}) {
        return {
            index: 1,
            replacement: props.modelValue,
        };
    },
});

</script>

<style scoped>

</style>