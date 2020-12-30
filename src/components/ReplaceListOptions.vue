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

                <div>
                    <button class="text-red-500 font-bold text-lg" @click.prevent="deleteReplacement(index)">X</button>
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