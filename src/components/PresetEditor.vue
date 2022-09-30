<template>
    <form>
        <h1 class="text-2xl">Edit Preset</h1>

        <div class="my-2 form-control">
            <label for="step-label" class="label">
                <span class="label-text">Name</span>
            </label>
            <input
                id="step-label"
                v-model="preset.name"
                class="input input-bordered"
                type="text"
            >
        </div>

        <div class="flex flex-1 justify-between mt-10">
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
                class="btn btn-error flex-2"
                @click.prevent="deleteStep"
                :disabled="isLastPreset"
            >Delete Preset
            </button>
        </div>
    </form>
</template>

<script lang="ts">
import {computed, defineComponent, reactive} from 'vue';
import _ from 'lodash';
import {useRouter} from 'vue-router';
import Preset from '@/preset';
import {usePresetStore} from '@/stores/preset';

export default defineComponent({
    props: {
        modelValue: {
            type: Preset,
            required: true,
        },
    },
    setup(props) {
        const router = useRouter();
        const presetStore = usePresetStore();
        const preset = reactive(_.cloneDeep(props.modelValue));

        return {
            preset: preset,

            isLastPreset: computed((): boolean => {
                return presetStore.presets.length === 1;
            }),

            save: () => {
                presetStore.updatePreset(preset);
                router.push({name: 'files', params: {presetId: preset.id}});
            },

            close: () => {
                router.push({name: 'files', params: {presetId: preset.id}});
            },

            deleteStep: () => {
                presetStore.deletePreset(preset);
                router.push('/');
            },
        };
    },
});
</script>

<style scoped>
</style>