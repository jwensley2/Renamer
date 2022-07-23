<template>
    <div class="flex h-full">
        <div id="sidebar" class="border-r border-neutral h-full pr-2">
            <presets :preset-id="preset.id" class="mb-4"/>
            <steps-list :preset="preset"/>
        </div>

        <div id="main" class="flex-grow ml-2 overflow-auto max-h-full">
            <router-view></router-view>
        </div>
    </div>
</template>

<script lang="ts">
import {defineComponent} from 'vue';
import Presets from '@/components/PresetList.vue';
import StepsList from '@/components/StepsList.vue';
import Preset from '@/preset';

export default defineComponent({
    props: {
        preset: Preset,
    },
    components: {
        Presets,
        StepsList,
    },
    setup(props) {
        return {};
    },
});
</script>

<style scoped>
</style>