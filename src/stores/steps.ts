import {defineStore} from 'pinia';
import config from '@/config';
import Step, {StepConfig} from '@/step';
import _ from 'lodash';
import {usePresetStore} from '@/stores/preset';
import Preset from '@/preset';

interface State {
    steps: StepConfig[];
}

export const useStepStore = defineStore('step', {
    state: (): State => ({
        steps: config.get('steps') as StepConfig[] ?? [],
    }),

    getters: {
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
        /**
         * Get the steps for a preset
         */
        getSteps: () => (presetId: string, active?: true): Step[] => {
            const presetStore = usePresetStore();

            const steps = presetStore.getPreset(presetId)?.steps;

            if (!steps) {
                return [];
            }

            if (active === true) {
                return steps.filter((step: Step) => step.active);
            }

            return steps;
        },
    },

    actions: {
        /**
         * Add a new step
         * @param step
         */
        addStep(step: Step) {
            this.steps.push(step);
            config.set('steps', this.steps);
        },

        /**
         * Add a new step
         * @param steps
         */
        addSteps(steps: Step[]) {
            this.steps.push(...steps);
            config.set('steps', this.steps);
        },

        /**
         * Update an existing step
         */
        updateStep(step: Step) {
            const index = _.findIndex(this.steps, {id: step.id});
            this.steps.splice(index, 1, step);

            config.set('steps', this.steps);
        },

        /**
         * Delete a step
         * @param step
         */
        deleteStep(step: Step) {
            const index = _.findIndex(this.steps, {id: step.id});
            this.steps.splice(index, 1);

            config.set('steps', this.steps);
        },

        /**
         * Set the active state for a step
         */
        setStepActive(id: string, active = true) {
            const step = _.find(this.steps, {id: id});

            if (step) {
                step.active = active;
                config.set('steps', this.steps);
            }
        },

        /**
         * Move a step to a new position in the steps
         */
        addStepForPreset(preset: Preset, step: Step) {
            const presetStore = usePresetStore();

            preset.steps.push(step);

            this.addStep(step);
            presetStore.updatePreset(preset);
        },

        /**
         * Move a step to a new position in a presets steps
         */
        moveStep(preset: Preset, oldIndex: number, newIndex: number) {
            const presetStore = usePresetStore();
            const steps = preset.steps;

            // Splice the step out of its previous position and into the new position
            steps.splice(newIndex, 0, ...steps.splice(oldIndex, 1));

            presetStore.updatePreset(preset);
        },

        /**
         * Prune any steps that are not currently used in a preset
         */
        pruneSteps() {
            const presetStore = usePresetStore();
            const usedStepIds: string[] = [];

            presetStore.presets.forEach((preset) => {
                usedStepIds.push(...preset.steps);
            });

            this.steps = this.steps.filter((step) => usedStepIds.indexOf(step.id) !== -1);
            config.set('steps', this.steps);
        },
    },
});