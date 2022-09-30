import {defineStore} from 'pinia';
import {Theme} from '@/theme';
import config from '@/config';

interface State {
    theme: Theme;
    clearOnRename: boolean;
}

export const useSettingsStore = defineStore('settings', {
    state: (): State => ({
        theme: config.get('theme', Theme.Dark) as Theme,
        clearOnRename: !!config.get('clearOnRename', false),
    }),

    getters: {},

    actions: {
        /**
         * Set the application theme
         * @param theme
         */
        setTheme(theme: Theme) {
            this.theme = theme;

            config.set('theme', theme);
        },

        /**
         * Set the clear on rename settings
         * @param value
         */
        setClearOnRename(value: boolean) {
            this.clearOnRename = value;

            config.set('clearOnRename', value);
        },
    },
});