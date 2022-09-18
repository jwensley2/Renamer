<template>
    <div class="flex h-full">
        <div id="sidebar" class="flex-grow max-w-fit min-w-fit border-r border-neutral pr-2 overflow-y-auto">
            <div class="h-full flex flex-col flex-grow-0 justify-items-stretch relative">
                <presets :preset-id="preset.id" class="mb-4"/>
                <steps-list :preset="preset"/>
            </div>
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