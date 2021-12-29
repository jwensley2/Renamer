<template>
    <div class="w-full text-center">
        <template v-if="presets.length > 0">
            <h1 class="text-lg font-semibold mb-3">Select a Preset</h1>

            <ul class="border border-collapse w-1/2 mx-auto rounded">
                <li class="preset" v-for="preset in presets" :key="preset.id">
                    <button
                        class="w-full p-2 hover:bg-gray-400"
                        @click.prevent="$router.push({name: 'preset', params: {presetId: preset.id}})"
                    >
                        {{ preset.name }}
                    </button>
                </li>
            </ul>
        </template>
        <div v-else>
            <h1 class="text-lg font-semibold mb-3">No Presets Exist</h1>

            <button @click.prevent="createPreset" class="btn bg-blue-500 hover:bg-blue-400 text-white px-20">Create Preset</button>
        </div>
    </div>
</template>

<script lang="ts">
import {computed, defineComponent} from 'vue';
import {useStore} from '@/store';
import Preset from '@/preset';
import {useRouter} from 'vue-router';

export default defineComponent({
    name: 'Home',
    setup() {
        const store = useStore();
        const router = useRouter();

        return {
            presets: computed(() => store.state.presets),
            createPreset() {
                const preset = new Preset('New Preset');

                store.commit('addPreset', preset);
                router.push({name: 'edit', params: {presetId: preset.id}});
            },
        };
    },
});
</script>

<style lang="scss" scoped>
.preset {
    + .preset {
        border-top-width: 1px
    }
}
</style>