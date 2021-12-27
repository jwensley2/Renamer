<template>
    <div class="flex h-full">
        <div id="sidebar" class="border-r h-full pr-2">
            <presets :preset-id="presetId" class="mb-4"/>
            <steps :preset-id="presetId"/>
        </div>

        <div id="main" class="flex-grow ml-2 overflow-auto max-h-full">
            <router-view></router-view>
        </div>
    </div>
</template>

<script lang="ts">
import {defineComponent} from 'vue';
import Presets from '@/components/Presets.vue';
import Steps from '@/components/Steps.vue';

export default defineComponent({
    name: 'Preset',
    props: {
        presetId: String,
    },
    components: {
        Presets,
        Steps,
    },
    setup(props) {
        return {};
    },
});
</script>

<style scoped>
</style>