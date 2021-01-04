<template>
    <div>
        <h2 class="text-lg mt-4">Replacements</h2>

        <div>
            <div
                v-for="(replacement, index) in options.replacements"
                :key="index"
                class="flex flex-1 items-center pt-2 pb-3 border-t first:border-t-0"
            >
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
                    <button class="text-red-500 text-lg w-4 h-4" @click.prevent="deleteReplacement(index)">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                            <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
                        </svg>
                    </button>
                </div>
            </div>
        </div>

        <button class="btn btn-sm btn-primary" @click.prevent="addReplacement">Add Replacement</button>
    </div>
</template>

<script lang="ts">
import {defineComponent, reactive, watch} from 'vue';
import _ from 'lodash';

export default defineComponent({
    name: 'ReplaceListOptions',
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
            addReplacement: () => {
                if (!options.replacements) {
                    options.replacements = [];
                }

                options.replacements.push({});
            },
            deleteReplacement: (index: number) => {
                options.replacements.splice(index, 1);
            },
        };
    },
});
</script>

<style scoped>

</style>