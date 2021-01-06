<template>
    <div>
        <h2 class="text-lg font-semibold">Preset</h2>

        <select v-model="selectedPreset" class="text-input">
            <option v-for="preset in presets" :key="preset.id" :value="preset">{{ preset.name }}</option>
        </select>

        <div class="flex justify-items-stretch mt-1">
            <button class="preset-buttons" @click.prevent="addPreset">Add Preset</button>
            <button
                v-if="selectedPreset"
                class="preset-buttons ml-2"
                @click.prevent="$emit('edit-preset', selectedPreset)"
            >
                Edit Preset
            </button>
        </div>
    </div>
</template>

<script lang="ts">
import {computed, defineComponent} from 'vue';
import Preset from '@/preset.ts';
import {useStore} from '@/store.ts';

export default defineComponent({
    name: 'Presets',
    setup(props, {emit}) {
        const store = useStore();

        return {
            presets: computed(() => store.state.presets),
            selectedPreset: computed({
                get: () => {
                    return store.getters.selectedPreset;
                },
                set: (preset) => {
                    emit('preset-changed', preset);
                    store.commit('setSelectedPreset', preset);
                },
            }),

            addPreset: () => {
                const preset = new Preset('');

                store.commit('addPreset', preset);
                emit('edit-preset', preset);
            },
        };
    },
});
</script>

<style scoped>
.preset-buttons {
    @apply w-full bg-blue-500 hover:bg-blue-400 text-white text-xs px-2 py-0.5;
}
</style>