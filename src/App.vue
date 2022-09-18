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
import {useStore} from '@/store';
import {useRouter} from 'vue-router';
import Settings from '@/views/SettingsView.vue';
import events from '@/events';

export default defineComponent({
    components: {
        Settings,
    },

    setup() {
        const store = useStore();
        const router = useRouter();
        const showSettings = ref(false);

        if (store.getters.selectedPreset) {
            router.push({name: 'files', params: {presetId: store.getters.selectedPreset.id}});
        }

        events.on('showSettings', () => {
            showSettings.value = true;
        });

        return {
            theme: computed(() => store.state.theme),
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