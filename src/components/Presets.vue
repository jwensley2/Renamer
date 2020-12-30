<template>
    <div>
        <h2>Preset</h2>

        <div class="flex justify-between center items-stretch">
            <select v-model="selectedPreset" class="text-input">
                <option v-for="preset in presets" :key="preset.id" :value="preset">{{ preset.name }}</option>
            </select>
            <button class="btn btn-sm btn-primary px-2 py-1 ml-1 mb-0" @click.prevent="addPreset">+</button>
            <button v-if="selectedPreset" class="btn btn-sm btn-primary px-2 py-1 ml-1 mb-0"
                    @click.prevent="$emit('edit-preset', selectedPreset)">E
            </button>
        </div>
    </div>
</template>

<script>
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
                }
            }),

            addPreset: () => {
                const preset = new Preset('');

                store.commit('addPreset', preset);
                emit('edit-preset', preset);
            },
        };
    }
})
</script>

<style scoped>

</style>