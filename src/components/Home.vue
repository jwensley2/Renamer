<template>
    <div class="w-full text-center">
        <h1 class="text-lg font-semibold">Select a Preset</h1>
        <ul class="border border-collapse w-1/2 mx-auto rounded mt-3">
            <li class="preset" v-for="preset in presets" :key="preset.id">
                <button
                    class="w-full p-2 hover:bg-gray-400"
                    @click.prevent="$router.push({name: 'preset', params: {presetId: preset.id}})"
                >
                    {{ preset.name }}
                </button>
            </li>
        </ul>
    </div>
</template>

<script lang="ts">
import {computed, defineComponent} from 'vue';
import {useStore} from '@/store';

export default defineComponent({
    name: 'Home',
    setup() {
        const store = useStore();

        return {
            presets: computed(() => store.state.presets),
        };
    },
});
</script>

<style lang="scss" scoped>
 .preset {
     +.preset { border-top-width: 1px }
 }
</style>