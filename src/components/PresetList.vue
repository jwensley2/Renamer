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
import {useRouter} from 'vue-router';
import {usePresetStore} from '@/stores/preset';

export default defineComponent({
    props: {
        presetId: {
            type: String,
            required: true,
        },
    },
    setup(props) {
        const presetStore = usePresetStore();
        const router = useRouter();

        return {
            presets: computed(() => presetStore.presets),
            selectedPreset: computed({
                get: () => {
                    return presetStore.getPreset(props.presetId)?.id;
                },
                set: (presetId) => {
                    if (presetId) {
                        presetStore.setSelectedPreset(presetId);
                        router.push({name: 'files', params: {presetId: presetId}});
                    }
                },
            }),

            addPreset: () => {
                const preset = new Preset('');

                presetStore.addPreset(preset);
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