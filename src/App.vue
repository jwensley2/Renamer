<template>
    <div class="p-2 h-full">
        <router-view></router-view>
    </div>
</template>

<script lang="ts">
import {defineComponent} from 'vue';
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

        return {};
    },
});
</script>

<style lang="scss">
html, body, #app {
    height: 100%;
}

.btn {
    @apply px-4 py-2 mb-2
}

.btn-sm {
    @apply py-1 text-sm;
}

.btn-primary {
    @apply text-white bg-blue-500 hover:bg-blue-400;
}

.btn-warning {
    @apply text-white bg-yellow-500 hover:bg-yellow-400;
}

.btn-danger {
    @apply text-white bg-red-500 hover:bg-red-400;
}

.text-input {
    @apply block border px-2 py-1 rounded w-full
}
</style>