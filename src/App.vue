<template>
    <div class="p-2 h-full" :data-theme="theme">
        <router-view></router-view>

        <div v-if="showSettings" class="absolute top-0 left-0 bg-inherit w-full h-full z-30">
            <settings @close="showSettings = false"/>
        </div>
    </div>
</template>

<script lang="ts">
import {computed, defineComponent, ref} from 'vue';
import {useRouter} from 'vue-router';
import events from '@/events';
import {useSettingsStore} from '@/stores/settings';
import {usePresetStore} from '@/stores/preset';
import Settings from '@/views/SettingsView.vue';

export default defineComponent({
    components: {
        Settings,
    },

    setup() {
        const settingsStore = useSettingsStore();
        const presetStore = usePresetStore();
        const router = useRouter();
        const showSettings = ref(false);

        if (presetStore.selectedPresetId) {
            router.push({name: 'files', params: {presetId: presetStore.selectedPresetId}});
        }

        events.on('showSettings', () => {
            showSettings.value = true;
        });

        return {
            theme: computed(() => settingsStore.theme),
            showSettings,
        };
    },
});
</script>

<style lang="scss">
html, body, #app {
    height: 100%;
}
</style>