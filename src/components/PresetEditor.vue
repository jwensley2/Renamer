<template>
    <form>
        <h1 class="text-2xl">Edit Preset</h1>

        <div class="my-2">
            <label for="step-label">Name</label>
            <input
                id="step-label"
                v-model="preset.name"
                class="text-input"
                type="text"
            >
        </div>

        <div class="flex flex-1 justify-between mt-10">
            <button
                class="btn btn-primary w-full mr-3"
                @click.prevent="save"
            >Save
            </button>
            <button
                class="btn btn-warning w-full mr-3"
                @click.prevent="close"
            >Cancel
            </button>

            <button
                class="btn btn-danger w-full"
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
import {useStore} from '@/store';
import {useRouter} from 'vue-router';

export default defineComponent({
    name: 'PresetEditor',
    props: {
        presetId: String,
    },
    setup(props, {emit}) {
        const router = useRouter();
        const store = useStore();
        const preset = reactive(_.cloneDeep(store.getters.getPreset(props.presetId)));

        return {
            preset: preset,

            isLastPreset: computed((): boolean => {
                return store.state.presets.length === 1;
            }),

            save: () => {
                store.commit('updatePreset', preset);
                router.push({name: 'files', params: {presetId: preset.id}});
            },

            close: () => {
                router.push({name: 'files', params: {presetId: preset.id}});
            },

            deleteStep: () => {
                store.commit('deletePreset', preset);
                router.push('/');
            },
        };
    },
});
</script>

<style scoped>
</style>