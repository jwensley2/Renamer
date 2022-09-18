<template>
    <div
        :class="{'drop-zone': draggingOver}"
        class="h-full flex flex-col flex-grow-0 justify-items-stretch relative"
        @drop="handleDrop($event); draggingOver = false"
        @dragover.prevent
        @dragenter.prevent="draggingOver = true"
        @dragleave.prevent="draggingOver = false"
    >
        <div
            v-if="draggingOver"
            class="flex justify-center items-center bg-accent text-accent-content top-0 bottom-0 left-0 right-0 absolute z-50"
        >
            <div class="text-2xl">Drop Files Here</div>
        </div>

        <div v-if="hasFiles" class="flex justify-between">
            <div>
                <button
                    class="btn btn-secondary align-middle mr-3"
                    @click="selectFiles"
                >
                    Select Files
                </button>

                <button
                    v-if="files.length > 0"
                    class="btn btn-primary gap-2 align-middle"
                    @click="renameFiles"
                >
                    <svg class="h-6 w-6 text-white inline-block" fill="currentColor" viewBox="0 0 20 20"
                         xmlns="http://www.w3.org/2000/svg">
                        <path clip-rule="evenodd"
                              d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"
                              fill-rule="evenodd"/>
                    </svg>
                    Rename Files
                </button>
            </div>

            <div>
                <button
                    class="btn btn-warning ml-3"
                    @click="clearFiles"
                >
                    Clear Files
                </button>
            </div>
        </div>

        <div v-if="hasFiles" class="overflow-x-auto overflow-y-auto mt-4">
            <table class="table table-compact w-full">
                <thead>
                <tr>
                    <th class="px-2 py-1">
                        <input
                            type="checkbox"
                            v-model="selectAll"
                            class="checkbox checkbox-xs"
                            :indeterminate.prop="selectAll === null"
                        />
                    </th>
                    <th class="px-2 py-1">Current Name</th>
                    <th class="px-2 py-1">New Name</th>
                    <th class="px-2 py-1">Directory</th>
                    <th v-if="hasErrors" class="px-2 py-1">Error</th>
                </tr>
                </thead>
                <tbody>
                <template v-if="files.length > 0">
                    <tr
                        v-for="file in files"
                        :key="file.id"
                        :class="{'active': file.name !== file.renamedName, 'text-red-500': file.error}"
                        class="hover whitespace-nowrap">
                        <td><input type="checkbox" class="checkbox checkbox-xs" v-model="file.selected"></td>
                        <td>{{ file.name }}{{ file.ext }}</td>
                        <td>{{ file.renamedName }}{{ file.renamedExt }}</td>
                        <td>{{ file.dir }}</td>
                        <td v-if="hasErrors">{{ file.error }}</td>
                    </tr>
                </template>
                <tr v-else>
                    <td class="text-center font-semibold py-5" colspan="3">
                        <p class="mb-2">No Files Selected</p>
                        <p>Click "Select Files" or Drag Files Into This Area</p>
                    </td>
                </tr>
                </tbody>
                <tfoot>
                <tr>
                    <th class="px-2 py-1">
                        <input
                            type="checkbox"
                            v-model="selectAll"
                            class="checkbox checkbox-xs"
                            :indeterminate.prop="selectAll === null"
                        />
                    </th>
                    <th class="px-2 py-1">Current Name</th>
                    <th class="px-2 py-1">New Name</th>
                    <th class="px-2 py-1">Directory</th>
                    <th v-if="hasErrors" class="px-2 py-1">Error</th>
                </tr>
                </tfoot>
            </table>
        </div>
        <div v-else-if="!draggingOver" class="hero min-h-max bg-base-200 flex-grow z-10">
            <div class="hero-content text-center">
                <div class="max-w-md">
                    <h1 class="text-5xl font-bold">No Files Selected</h1>
                    <p class="py-6">Select some files you want to rename to get started.</p>
                    <button class="btn btn-primary" @click="selectFiles">Select Some Files</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import {computed, defineComponent, ref} from 'vue';
import {useStore} from '@/store';
import {ipcRenderer, IpcRendererEvent, OpenDialogReturnValue} from 'electron';
import SelectedFile from '@/file';
import _ from 'lodash';
import Preset from '@/preset';

export default defineComponent({
    props: {
        preset: {
            type: Preset,
            required: true,
        },
    },
    setup(props) {
        const store = useStore();
        const files = computed(() => {
            return props.preset.transformFiles(store.getters.files);
        });
        const draggingOver = ref(false);

        return {
            files: files,
            hasErrors: computed(() => files.value.filter((file: SelectedFile) => file.error).length > 0),
            draggingOver: draggingOver,
            hasFiles: computed(() => files.value.length > 0),
            selectAll: computed({
                get: () => {
                    let hasSelected = false;
                    let hasUnselected = false;

                    files.value.forEach((file) => {
                        hasSelected = hasSelected || file.selected;
                        hasUnselected = hasUnselected || !file.selected;
                    });

                    console.log((hasSelected && hasUnselected) ? null : (hasSelected && !hasUnselected));
                    return (hasSelected && hasUnselected) ? null : (hasSelected && !hasUnselected);
                },
                set: (newValue) => {
                    files.value.forEach((file) => {
                        file.selected = !!newValue;
                    });
                },
            }),
            selectFiles: () => {
                ipcRenderer.send('select-files');

                ipcRenderer.on('files-selected', (event: IpcRendererEvent, arg: OpenDialogReturnValue) => {
                    store.state.files = arg.filePaths.map((filePath) => {
                        return new SelectedFile(filePath);
                    });
                });
            },
            clearFiles: () => {
                store.commit('clearFiles');
            },
            renameFiles: () => {
                files.value.forEach((file: SelectedFile) => {
                    file.rename();
                });

                if (store.state.clearOnRename) {
                    store.commit('clearFiles');
                }
            },
            handleDrop: (event: DragEvent) => {
                if (!event.dataTransfer) return;

                _.each(event.dataTransfer.items, (item) => {
                    if (item.kind === 'file') {
                        const file = item.getAsFile();
                        if (file) store.commit('addFileFromPath', file.path);
                    }
                });
            },
        };
    },
});
</script>

<style lang="scss" scoped>
#files {
    margin: 0;
    padding: 0;
    list-style: none;
}

.drop-zone * {
    pointer-events: none
}
</style>