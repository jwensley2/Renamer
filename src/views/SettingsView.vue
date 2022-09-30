<template>
    <div class="w-full py-2 px-5">
        <h1 class="text-2xl mb-2">Settings</h1>

        <div class="form-control w-full max-w-xs">
            <label class="label">
                <span class="label-text">Theme</span>
            </label>
            <select v-model="theme" class="select select-bordered">
                <option v-for="(theme, label) in themes" :value="theme" :key="theme">{{ label }}</option>
            </select>
        </div>


        <div class="form-control w-full max-w-xs mt-4">
            <label class="label cursor-pointer">
                <span class="label-text">Clear on rename</span>
                <input v-model="clearOnRename" type="checkbox" class="checkbox checkbox-sm">
            </label>
        </div>

        <button class="btn btn-sm btn-accent btn-circle absolute top-2 right-3" @click.prevent="$emit('close')">
            <XMarkIcon class="h-5 w-5"/>
        </button>
    </div>
</template>

<script lang="ts">
import {computed, defineComponent} from 'vue';
import {Theme} from '@/theme';
import {XMarkIcon} from '@heroicons/vue/20/solid';
import {useSettingsStore} from '@/stores/settings';

export default defineComponent({
    name: 'SettingsView',
    components: {
        XMarkIcon,
    },
    emits: ['close'],
    setup() {
        const store = useSettingsStore();

        return {
            store,
            themes: Theme,
            theme: computed({
                get: () => store.theme,
                set: (newValue) => store.setTheme(newValue),
            }),
            clearOnRename: computed({
                get: () => store.clearOnRename,
                set: (newValue) => store.setClearOnRename(newValue),
            }),
        };
    },
});
</script>

<style scoped>

</style>