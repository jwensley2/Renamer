<template>
    <div>
        <div class="flex items-baseline mt-4 mb-3">
            <h2 class="text-lg font-semibold flex-1">Replacements</h2>

            <div v-if="totalReplacements > 1" class="form-control">
                <div class="input-group">
                    <input type="search" v-model="filter" class="input input-sm input-bordered w-auto inline-block" placeholder="Search">
                    <span>
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path
                            stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
                    </span>
                </div>
            </div>
        </div>

        <div>
            <div v-if="replacements.length === 0" class="alert my-3">
                <div>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" class="stroke-info flex-shrink-0 w-6 h-6">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                    <span v-if="totalReplacements === 0">No replacements have been added.</span>
                    <span v-else>No replacements match your search.</span>
                </div>
            </div>

            <div
                v-for="(replacement, index) in replacements"
                :key="replacement.id"
                class="border-t first:border-t-0 border-neutral"
            >
                <replacement v-model="replacements[index]" @delete="deleteReplacement(replacement)" :key="replacement.id"></replacement>
            </div>
        </div>

        <button class="btn btn-sm btn-primary mt-2 mb-3" @click.prevent="addReplacement">Add Replacement</button>
    </div>
</template>

<script lang="ts">
import {computed, defineComponent, reactive, ref, watch} from 'vue';
import _ from 'lodash';
import {Options as ReplaceOptions, Replacement} from '@/transformers/replace-list';
import {default as ReplacementComponent} from '@/components/ReplacementStep.vue';
import {v4 as uuidv4} from 'uuid';

export default defineComponent({
    name: 'ReplaceListOptions',
    components: {
        Replacement: ReplacementComponent,
    },
    props: {
        modelValue: null,
    },
    setup(props, {emit}) {
        const options: ReplaceOptions = reactive(_.cloneDeep(props.modelValue));
        const newReplacementIds: string[] = [];
        const filter = ref('');

        watch(options, (newValue: ReplaceOptions) => {
            emit('update:modelValue', newValue);
        }, {deep: true});

        return {
            filter: filter,
            options: options,
            totalReplacements: computed(() => options.replacements.length),
            replacements: computed(() => {
                return options.replacements.filter((replacement: Replacement) => {
                    const search = filter.value.toLowerCase();

                    // Don't filter if search is empty
                    if (search === '') return true;

                    // Always show newly created replacements
                    if (newReplacementIds.includes(replacement.id)) return true;

                    return (replacement.search && replacement.search.toLowerCase().includes(search)) ||
                        (replacement.replace && replacement.replace.toLowerCase().includes(search));
                });
            }),
            addReplacement: () => {
                const replacement = {
                    id: uuidv4(),
                    search: '',
                    replace: '',
                    regex: false,
                    caseInsensitive: false,
                };

                options.replacements.push(replacement);
                newReplacementIds.push(replacement.id);
            },

            deleteReplacement: (replacement: Replacement) => {
                const index = _.findIndex(options.replacements, {id: replacement.id});
                options.replacements.splice(index, 1);
            },
        };
    },
});
</script>

<style scoped>

</style>