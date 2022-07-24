<template>
    <div class="p-2 h-full" :data-theme="theme">
        <router-view></router-view>
    </div>
</template>

<script lang="ts">
import {computed, defineComponent} from 'vue';
import {useStore} from '@/store';
import {useRouter} from 'vue-router';

export default defineComponent({
    components: {},

    setup() {
        const store = useStore();
        const router = useRouter();

        if (store.getters.selectedPreset) {
            router.push({name: 'files', params: {presetId: store.getters.selectedPreset.id}});
        }

        return {
            theme: computed(() => store.state.theme),
        };
    },
});
</script>

<style lang="scss">
html, body, #app {
    height: 100%;
}
</style>