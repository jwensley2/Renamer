<template>
    <form class="flex flex-col max-h-full">
        <div class="overflow-y-auto pr-3">
            <h1 class="text-2xl">Edit Step</h1>

            <div class="form-control w-full my-2">
                <label for="step-label" class="label">
                    <span class="label-text">Step Name</span>
                </label>
                <input
                    id="step-label"
                    v-model="step.label"
                    class="input input-bordered"
                    type="text"
                >
            </div>

            <div class="form-control my-2">
                <label for="step-type" class="label">
                    <span class="label-text">Type</span>
                </label>
                <select id="step-type" v-model="step.transformer" class="select select-bordered" @change="transformerChanged">
                    <option v-for="type in TransformerType" :key="type" :value="type">{{ transformerLabel(type) }}</option>
                </select>
            </div>

            <template v-if="step.transformer === TransformerType.ChangeCase">
                <div class="form-control my-2">
                    <label for="step-part" class="label">
                        <span class="label-text">Part</span>
                    </label>

                    <select id="step-part" v-model="step.options.part" class="select select-bordered">
                        <option v-for="part in Part" :key="part" :value="part">{{ part }}</option>
                    </select>
                </div>

                <div class="form-control my-2">
                    <label class="label">
                        <span class="label-text">Change Case To</span>
                    </label>
                    <select v-model="step.options.case" class="select select-bordered">
                        <option v-for="textCase in Case" :key="textCase" :value="textCase">{{ caseLabel(textCase) }}</option>
                    </select>
                </div>
            </template>
            <template v-else-if="step.transformer === TransformerType.Replace">
                <replace-options v-model="step.options" :key="step.id"></replace-options>
            </template>
            <template v-else-if="step.transformer === TransformerType.ReplaceList">
                <replace-list-options v-model="step.options" :key="step.id"></replace-list-options>
            </template>
            <template v-else-if="step.transformer === TransformerType.Trim">
                <div class="form-control my-2">
                    <label for="trim-characters" class="label">
                        <span class="label-text">Characters</span>
                    </label>
                    <input
                        id="trim-characters"
                        v-model="step.options.characters"
                        class="input input-bordered"
                        type="text"
                    >
                </div>
            </template>
            <template v-else-if="step.transformer === TransformerType.Rename">
                <rename-options v-model="step.options" :key="step.id"></rename-options>
            </template>
        </div>

        <div class="flex justify-items-stretch pt-3 border-t border-neutral">
            <button
                class="btn btn-primary flex-1 mr-3"
                @click.prevent="save"
            >Save
            </button>
            <button
                class="btn btn-warning flex-1 mr-3"
                @click.prevent="close"
            >Cancel
            </button>

            <button
                class="btn btn-error flex-1"
                @click.prevent="deleteStep"
            >Delete Step
            </button>
        </div>
    </form>
</template>

<script lang="ts">
import {label as transformerLabel, TransformerType} from '@/transformers/transformer';
import {computed, defineComponent, reactive, ref} from 'vue';
import _ from 'lodash';
import {Case, caseLabel} from '@/transformers/change-case';
import {Part} from '@/file';
import ReplaceListOptions from '@/components/ReplaceListOptions.vue';
import ReplaceOptions from '@/components/ReplaceOptions.vue';
import RenameOptions from '@/components/RenameOptions.vue';
import {onBeforeRouteUpdate, useRouter} from 'vue-router';
import {useStore} from '@/store';
import Preset from '@/preset';
import Step from '@/step';

export default defineComponent({
    name: 'StepEditor',
    components: {RenameOptions, ReplaceOptions, ReplaceListOptions},
    props: {
        modelValue: {
            type: Step,
            required: true,
        },
    },
    setup(props): Record<string, unknown> {
        const router = useRouter();
        const store = useStore();
        const step = ref(reactive(_.cloneDeep(props.modelValue)));
        const preset: Preset = store.getters.selectedPreset;

        console.log(props.modelValue, step.value);

        onBeforeRouteUpdate(async (to, from) => {
            if (to.params.stepId !== from.params.stepId) {
                step.value = reactive(_.cloneDeep(store.getters.getStep(to.params.stepId)));
            }
        });

        return {
            step: step,
            TransformerType: TransformerType,
            transformerLabel: transformerLabel,
            Case: Case,
            Part: computed(() => {
                return _.filter(Part, (part) => typeof (part) === 'string');
            }),
            caseLabel: caseLabel,
            save: () => {
                store.commit('updateStep', step.value);
                router.push({name: 'files', params: {presetId: preset.id}});
            },
            close: () => {
                router.push({name: 'files', params: {presetId: preset.id}});
            },
            deleteStep: () => {
                store.commit('deleteStep', step.value);
                router.push({name: 'files', params: {presetId: preset.id}});
            },
            transformerChanged: () => {
                step.value.options = step.value.mergeOptionsWithDefaults(step.value.options);
            },
        };
    },
});
</script>

<style scoped>
</style>