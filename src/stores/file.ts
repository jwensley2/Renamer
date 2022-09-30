import {defineStore} from 'pinia';
import _ from 'lodash';
import SelectedFile, {SelectedFileInterface} from '@/file';
import chokidar from 'chokidar';

interface State {
    files: SelectedFileInterface[];
}

export const useFileStore = defineStore('file', {
    state: (): State => ({
        files: [],
    }),

    getters: {},

    actions: {
        /**
         * Add a new file from the file path, if the file has already been added it will be ignored
         */
        addFileFromPath(path: string) {
            if (!_.find(this.files, {path: path})) {
                const file = new SelectedFile(path);

                this.files.push(file);

                // Remove any files that get renamed/deleted
                chokidar.watch(path).once('unlink', () => {
                    this.removeFileByPath(path);
                });
            }
        },

        /**
         * Add a new file from the file path, if the file has already been added it will be ignored
         */
        addFilesFromPaths(paths: string[]) {
            const files = paths.filter((path) => {
                return !_.find(this.files, {path: path});
            }).map((path) => {
                return new SelectedFile(path);
            });

            this.files.push(...files);

            paths.forEach((path) => {
                // Remove any files that get renamed/deleted
                chokidar.watch(path).once('unlink', () => {
                    this.removeFileByPath(path);
                });
            });
        },

        /**
         * Remove a file by its path
         */
        removeFileByPath(path: string) {
            this.files = _.filter(this.files, (file) => {
                return file.path !== path;
            });
        },

        /**
         * Clear the list of files
         */
        clearFiles() {
            this.files.length = 0;
        },
    },
});