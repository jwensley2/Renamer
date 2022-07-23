<template>
    <div id="presets-sidebar">
        <h2 class="text-lg font-semibold">Preset</h2>

        <select v-model="selectedPreset" class="select select-sm select-bordered w-full mb-1">
            <option v-for="preset in presets" :key="preset.id" :value="preset.id">{{ preset.name }}</option>
        </select>

        <div class="flex justify-items-stretch mt-1">
            <button class="btn btn-secondary btn-xs flex-1 mr-2" @click.prevent="addPreset">Add Preset</button>
            <button
                v-if="selectedPreset"
                class="btn btn-secondary btn-xs flex-1"
                @click.prevent="$router.push({name: 'edit', params: {presetId: selectedPreset}})"
            >
                Edit Preset
            </button>
        </div>
    </div>
</template>

<script lang="ts">
import {computed, defineComponent} from 'vue';
import Preset from '@/preset';
import {useStore} from '@/store';
import {useRouter} from 'vue-router';

export default defineComponent({
    props: {
        presetId: String,
    },
    setup(props) {
        const store = useStore();
        const router = useRouter();

        return {
            presets: computed(() => store.state.presets),
            selectedPreset: computed({
                get: () => {
                    return store.getters.getPreset(props.presetId)?.id;
                },
                set: (presetId) => {
                    store.commit('setSelectedPreset', presetId);
                    router.push({name: 'files', params: {presetId: presetId}});
                },
            }),

            addPreset: () => {
                const preset = new Preset('');

                store.commit('addPreset', preset);
                router.push({name: 'edit', params: {presetId: preset.id}});
            },
        };
    },
});
</script>

<style scoped>
#presets-sidebar {
    min-width : 200px;
}

.preset-buttons {
    @apply w-full bg-blue-500 hover:bg-blue-400 text-white text-xs px-2 py-0.5;
}
</style>