import {InjectionKey} from 'vue';
import {createStore, Store, useStore as baseUseStore} from 'vuex';
import Step from './step';
import {TransformerType} from '@/transformers/transformer';
import {Case} from '@/transformers/change-case';
import SelectedFile from '@/file';
import _ from 'lodash';
import Config from 'electron-store';
import Preset from '@/preset';

const config = new Config();

// Typings for the store state
export interface State {
    selectedPreset: Preset,
    presets: Preset[],
    files: SelectedFile[],
}

// define injection key
export const key: InjectionKey<Store<State>> = Symbol();

export const store = createStore<State>({
    state(): State {
        const defaultPresets = [
            new Preset('Default', [
                new Step('Change to Lowercase', TransformerType.ChangeCase),
                new Step('Replace Underscores', TransformerType.Replace, {search: '_', replace: ' '}),
                new Step('Replace Dashes', TransformerType.Replace, {search: '-+(\s*)-+', replace: '-'}),
                new Step('Replace List', TransformerType.ReplaceList, {
                    replacements: [
                        {
                            search: /plane/.source,
                            replace: 'train',
                            regex: true,
                            caseInsensitive: true,
                        },
                        {
                            search: /snakes/.source,
                            replace: 'rakes',
                            regex: true,
                            caseInsensitive: true,
                        },
                    ],
                }),
                new Step('Change to Titlecase', TransformerType.ChangeCase, {case: Case.TitleCase}),
            ]),
        ];

        const presets: Preset[] = config.has('presets') ? (config.get('presets') as Array<Record<string, unknown>>).map((step) => {
            return Preset.fromJSON(step);
        }) : defaultPresets;

        return {
            selectedPreset: config.has('selectedPreset') ? _.find(presets, {id: config.get('selectedPreset') as string}) || presets[0] : presets[0],
            presets: presets,
            files: [],
        };
    },

    mutations: {
        /**
         * Add a new preset
         * @param state
         * @param preset
         */
        addPreset(state: State, preset: Preset) {
            state.presets.push(preset);
        },

        /**
         * Update an existing preset
         * @param state
         * @param preset
         */
        updatePreset(state: State, preset: Preset) {
            const index = _.findIndex(state.presets, {id: preset.id});
            state.presets.splice(index, 1, preset);

            if (state.selectedPreset.id === preset.id) {
                state.selectedPreset = preset;
            }

            config.set('presets', state.presets);
        },

        /**
         * Delete a preset
         * @param state
         * @param step
         */
        deletePreset(state: State, preset: Preset) {
            const index = _.findIndex(state.presets, {id: preset.id});
            state.presets.splice(index, 1);

            config.set('presets', state.presets);
        },

        setSelectedPreset(state: State, preset: Preset) {
            state.selectedPreset = preset;

            config.set('selectedPreset', preset.id);
        },

        /**
         * Add a new step
         * @param state
         * @param step
         */
        addStep(state: State, step: Step) {
            state.selectedPreset.steps.push(step);
        },

        /**
         * Update an existing step
         * @param state
         * @param step
         */
        updateStep(state: State, step: Step) {
            const index = _.findIndex(state.selectedPreset.steps, {id: step.id});
            state.selectedPreset.steps.splice(index, 1, step);

            config.set('presets', state.presets);
        },

        /**
         * Delete a step
         * @param state
         * @param step
         */
        deleteStep(state: State, step: Step) {
            const index = _.findIndex(state.selectedPreset.steps, {id: step.id});
            state.selectedPreset.steps.splice(index, 1);

            config.set('presets', state.presets);
        },

        /**
         * Move a step to a new position in the steps
         * @param state
         * @param payload
         */
        moveStep(state: State, payload: { oldIndex: number, newIndex: number }) {
            const {oldIndex, newIndex} = payload;
            const steps = state.selectedPreset.steps;

            // Splice the step out of it's previous position and into the new position
            steps.splice(newIndex, 0, ...steps.splice(oldIndex, 1));

            config.set('presets', state.presets);
        },

        /**
         * Add a new file from the file path, if the file has already been added it will be ignored
         * @param state
         * @param path
         */
        addFileFromPath(state: State, path: string) {
            if (!_.find(state.files, {path: path})) {
                state.files.push(new SelectedFile(path));
            }
        },

        /**
         * Clear the list of files
         * @param state
         */
        clearFiles(state: State) {
            state.files = [];
        },
    },

    getters: {
        selectedPreset(state: State) {
            return state.selectedPreset;
        },

        steps(state: State) {
            return state.selectedPreset.steps;
        },

        activeSteps(state: State) {
            return state.selectedPreset.steps.filter((step) => {
                return step.active;
            });
        },

        files(state: State, getters) {
            return state.files.map((file) => file.transform(getters.activeSteps));
        },
    },
});

export function useStore(): Store<State> {
    return baseUseStore(key);
}