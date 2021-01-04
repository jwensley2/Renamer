<template>
    <div
        :class="{'drop-zone': draggingOver}"
        class="h-full flex flex-col justify-items-stretch relative"
        @drop="handleDrop($event); draggingOver = false"
        @dragover.prevent
        @dragenter.prevent="draggingOver = true"
        @dragleave.prevent="draggingOver = false"
    >
        <div
            v-if="draggingOver"
            class="flex justify-center items-center bg-gray-300 top-0 bottom-0 left-0 right-0 absolute"
        >
            <div class="text-2xl">Drop Files Here</div>
        </div>

        <div class="flex justify-between">
            <div>
                <button
                    class="btn btn-primary"
                    @click="selectFiles"
                >
                    Select Files
                </button>

                <button
                    v-if="files.length > 0"
                    class="btn bg-green-600 hover:bg-green-500 font-semibold text-white ml-3"
                    @click="renameFiles"
                >
                    <svg class="h-6 w-6 -mt-1 text-white inline-block" fill="currentColor" viewBox="0 0 20 20"
                         xmlns="http://www.w3.org/2000/svg">
                        <path clip-rule="evenodd"
                              d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"
                              fill-rule="evenodd"/>
                    </svg>
                    <span class="ml-2 leading-none">Rename Files</span>
                </button>
            </div>

            <div>
                <button
                    v-if="files.length > 0"
                    class="btn btn-warning ml-3"
                    @click="clearFiles"
                >
                    Clear Files
                </button>
            </div>
        </div>

        <div class="overflow-x-scroll overflow-y-auto">
            <table class="border w-full">
                <thead class="border-b bg-gray-100">
                <tr>
                    <td class="px-2 py-1">Current Name</td>
                    <td class="px-2 py-1">New Name</td>
                    <td class="px-2 py-1">Directory</td>
                    <td v-if="hasErrors" class="px-2 py-1">Error</td>
                </tr>
                </thead>
                <tbody>
                <template v-if="files.length > 0">
                    <tr
                        v-for="file in files"
                        :key="file.id"
                        :class="{'text-gray-400': file.name === file.renamedName, 'text-red-500': file.error}"
                        class="border-b whitespace-nowrap">
                        <td class="px-2 py-0.5">{{ file.name }}{{ file.ext }}</td>
                        <td class="px-2 py-0.5">{{ file.renamedName }}{{ file.renamedExt }}</td>
                        <td class="px-2 py-0.5">{{ file.dir }}</td>
                        <td v-if="hasErrors" class="px-2 py-0.5">{{ file.error }}</td>
                    </tr>
                </template>
                <tr v-else>
                    <td class="text-center font-semibold py-5" colspan="3">
                        <p class="mb-2">No Files Selected</p>
                        <p>Click "Select Files" or Drag Files Into This Area</p>
                    </td>
                </tr>
                </tbody>
                <tfoot class="border-b bg-gray-100">
                <tr>
                    <td class="px-2 py-1">Current Name</td>
                    <td class="px-2 py-1">New Name</td>
                    <td class="px-2 py-1">Directory</td>
                    <td v-if="hasErrors" class="px-2 py-1">Error</td>
                </tr>
                </tfoot>
            </table>
        </div>
    </div>
</template>

<script lang="ts">
import {computed, defineComponent, ref} from 'vue';
import {useStore} from '@/store';
import {ipcRenderer, IpcRendererEvent, OpenDialogReturnValue} from 'electron';
import SelectedFile from '@/file';
import _ from 'lodash';

export default defineComponent({
    setup() {
        const store = useStore();
        const files = computed(() => store.getters.files);
        const draggingOver = ref(false);

        return {
            files: files,
            hasErrors: computed(() => files.value.filter((file: SelectedFile) => file.error).length > 0),
            draggingOver: draggingOver,
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
                store.state.files.forEach((file) => {
                    file.rename();
                });
            },
            handleDrop: (event: DragEvent) => {
                if (!event.dataTransfer) return;

                _.each(event.dataTransfer.items, (item) => {
                    if (item.kind === 'file') {
                        const file = item.getAsFile();
                        if (file) store.commit('addFileFromPath', file.path);
                    }
                });
            }
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