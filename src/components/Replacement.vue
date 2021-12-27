<template>
    <div class="flex flex-1 items-center pt-2 pb-3">
        <div class="mr-2 flex-grow">
            <label :for="`step-search-${index}`" class="hidden">Search</label>
            <input
                :id="`step-search-${index}`"
                v-model="replacement.search"
                class="text-input"
                placeholder="Search For"
                type="text"
            >
        </div>

        <div class="mr-2 flex-grow">
            <label :for="`step-replace-${index}`" class="hidden">Replace</label>
            <input
                :id="`step-replace-${index}`"
                v-model="replacement.replace"
                class="text-input"
                placeholder="Replace With"
                type="text"
            >
        </div>

        <div class="mr-2 whitespace-nowrap items-center text-sm" style="min-width: 150px">
            <div class="mt-0">
                <label><input v-model="replacement.regex" class="mr-1" type="checkbox"> Regex</label>
            </div>

            <div v-if="replacement.regex">
                <label><input v-model="replacement.caseInsensitive" class="mr-1" type="checkbox"> Case Insensitive</label>
            </div>
        </div>

        <div class="pr-2">
            <button class="text-red-500 text-lg w-4 h-4" @click.prevent="$emit('delete')">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd"
                          d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                          clip-rule="evenodd"/>
                </svg>
            </button>
        </div>
    </div>
</template>

<script lang="ts">
import {defineComponent} from 'vue';

export default defineComponent({
    name: 'Replacement',

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