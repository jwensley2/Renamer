<template>
    <div>
        <div class="flex items-baseline mt-4">
            <h2 class="text-lg font-semibold flex-1">Replacements</h2>

            <div class="text-sm text-right">
                Search: <input type="text" v-model="filter" class="text-input w-auto inline-block">
            </div>
        </div>

        <div>
            <div v-if="replacements.length === 0" class="px-2 py-2 my-3 bg-gray-200 text-sm">
                No replacements match your search.
            </div>

            <div
                v-for="(replacement, index) in replacements"
                :key="replacement.id"
                class="border-t first:border-t-0"
            >
                <replacement v-model="replacements[index]" @delete="deleteReplacement(replacement)" :key="replacement.id"></replacement>
            </div>
        </div>

        <button class="btn btn-sm btn-primary" @click.prevent="addReplacement">Add Replacement</button>
    </div>
</template>

<script lang="ts">
import {computed, defineComponent, reactive, ref, watch} from 'vue';
import _ from 'lodash';
import {Options as ReplaceOptions, Replacement} from '@/transformers/replace-list';
import {default as ReplacementComponent} from '@/components/Replacement.vue';
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