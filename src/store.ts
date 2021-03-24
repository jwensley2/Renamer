import {InjectionKey} from 'vue';
import {createStore, Store, useStore as baseUseStore} from 'vuex';
import Step, {StepConfig} from './step';
import SelectedFile from '@/file';
import _ from 'lodash';
import config from '@/config';
import Preset, {PresetConfig} from '@/preset';

// Typings for the store state
export interface State {
    selectedPreset?: string,
    presets: Array<PresetConfig>,
    steps: Array<StepConfig>,
    files: SelectedFile[],
}

// define injection key
export const key: InjectionKey<Store<State>> = Symbol();

export const store = createStore<State>({
    state(): State {
        return {
            selectedPreset: config.get('selectedPreset') as string,
            presets: config.get('presets') as Array<PresetConfig> ?? [],
            steps: config.get('steps') as Array<StepConfig> ?? [],
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
            state.presets.push(preset.toJSON());
        },

        /**
         * Update an existing preset
         * @param state
         * @param preset
         */
        updatePreset(state: State, preset: Preset) {
            const index = _.findIndex(state.presets, {id: preset.id});
            state.presets.splice(index, 1, preset.toJSON());

            config.set('presets', state.presets);
        },

        /**
         * Delete a preset
         * @param state
         * @param preset
         */
        deletePreset(state: State, preset: Preset) {
            const index = _.findIndex(state.presets, {id: preset.id});
            state.presets.splice(index, 1);

            config.set('presets', state.presets);
        },

        /**
         * Set the currently selected preset
         * @param state
         * @param {string} id
         */
        setSelectedPreset(state: State, id: string) {
            state.selectedPreset = id;
            config.set('selectedPreset', id);
        },

        /**
         * Save the presets to the config file
         * @param state
         */
        savePresets(state: State) {
            config.set('presets', state.presets);
        },

        /**
         * Add a new step
         * @param state
         * @param step
         */
        addStep(state: State, step: Step) {
            state.steps.push(step);
            config.set('steps', state.steps);
        },

        /**
         * Update an existing step
         * @param state
         * @param payload
         */
        updateStep(state: State, step: Step) {
            const index = _.findIndex(state.steps, {id: step.id});
            state.steps.splice(index, 1, step);

            config.set('steps', state.steps);
        },

        /**
         * Delete a step
         * @param state
         * @param step
         */
        deleteStep(state: State, step: Step) {
            const index = _.findIndex(state.steps, {id: step.id});
            state.steps.splice(index, 1);

            config.set('steps', state.steps);
            config.set('presets', state.presets);
        },

        /**
         * Set the active state for a step
         * @param state
         * @param payload
         */
        setStepActive(state: State, payload: { id: string, active: boolean }) {
            const {id, active} = payload;
            const step = _.find(state.steps, {id: id});

            if (step) {
                step.active = active;
                config.set('steps', state.steps);
            }
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
        /**
         * Get a preset by id
         * @param state
         * @param getters
         */
        getPreset: (state: State, getters) => (id: string): Preset | undefined => {
            const presetConfig = _.find(state.presets, {
                id: id,
            });

            if (!presetConfig) return;

            const preset = Preset.fromJSON(presetConfig);

            preset.steps = presetConfig.steps.map((step) => {
                return getters.getStep(step);
            }).filter((step: Step | undefined) => {
                return typeof step !== 'undefined';
            });

            return preset;
        },

        /**
         * Get a step for a preset by id
         * @param state
         */
        getStep: (state: State) => (id: string): Step | undefined => {
            const stepConfig = _.find(state.steps, {
                id: id,
            });

            if (!stepConfig) return;

            return Step.fromJSON(stepConfig);
        },

        selectedPreset(state: State, getters): Preset {
            return getters.getPreset(state.selectedPreset);
        },

        /**
         * Get the steps for a preset
         * @param state
         * @param getters
         */
        getSteps: (state: State, getters) => (preset: string, active?: true): Step[] => {
            if (active === true) {
                return getters.getPreset(preset).steps.filter((step: Step) => step.active);
            }

            return getters.getPreset(preset).steps;
        },

        /**
         * Get the selected files
         * @param state
         */
        files(state: State): SelectedFile[] {
            return state.files;
        },
    },

    actions: {
        /**
         * Move a step to a new position in the steps
         */
        addStepForPreset({commit}, payload: { preset: Preset, step: Step }) {
            const {preset, step} = payload;

            preset.steps.push(step);

            commit('addStep', step);
            commit('updatePreset', preset);
        },

        /**
         * Move a step to a new position in a presets steps
         */
        moveStep({commit}, payload: { preset: Preset, oldIndex: number, newIndex: number }) {
            const {preset, oldIndex, newIndex} = payload;
            const steps = preset.steps;

            // Splice the step out of its previous position and into the new position
            steps.splice(newIndex, 0, ...steps.splice(oldIndex, 1));

            commit('updatePreset', preset);
        },

        /**
         * Prune any steps that are not currently used in a preset
         * @param state
         */
        pruneSteps({state}) {
            const usedStepIds: Array<string> = [];

            state.presets.forEach((preset) => {
                usedStepIds.push(...preset.steps);
            });

            state.steps = state.steps.filter((step) => usedStepIds.indexOf(step.id) !== -1);
            config.set('steps', state.steps);
        },
    },
});

export function useStore(): Store<State> {
    return baseUseStore(key);
}