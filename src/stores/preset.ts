import {defineStore} from 'pinia';
import _ from 'lodash';
import Preset, {PresetConfig, PresetInterface} from '@/preset';
import config from '@/config';
import Step from '@/step';
import {TransformerType} from '@/transformers/transformer';
import {Case} from '@/transformers/change-case';
import {useStepStore} from '@/stores/steps';

interface State {
    selectedPresetId?: string;
    presets: PresetConfig[];
}

export const usePresetStore = defineStore('preset', {
    state: (): State => ({
        selectedPresetId: config.get('selectedPreset') as string | undefined,
        presets: config.get('presets') as PresetConfig[] ?? [],
    }),

    getters: {
        selectedPreset(): PresetInterface | undefined {
            if (!this.selectedPresetId) return;

            return this.getPreset(this.selectedPresetId);
        },

        /**
         * Get a preset by id
         * @param state
         */
        getPreset: (state: State) => (id: string): PresetInterface | undefined => {
            const stepStore = useStepStore();

            const presetConfig = _.find(state.presets, {id: id});

            if (!presetConfig) return;

            const preset = Preset.fromJSON(presetConfig);

            preset.steps = presetConfig.steps.map((step) => {
                return stepStore.getStep(step);
            }).filter((step: Step | undefined) => {
                return step instanceof Step;
            }) as Step[];

            return preset;
        },
    },

    actions: {
        setupDefault(): void {
            const stepStore = useStepStore();

            const preset = new Preset('Default', [
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
            ]);

            stepStore.addSteps(preset.steps);

            this.addPreset(preset);
            this.savePresets();
            this.setSelectedPreset(preset.id);
        },

        /**
         * Add a new preset
         * @param preset
         */
        addPreset(preset: PresetInterface) {
            this.presets.push(preset.toJSON());
        },

        /**
         * Update an existing preset
         * @param preset
         */
        updatePreset(preset: PresetInterface) {
            const index = _.findIndex(this.presets, {id: preset.id});
            this.presets.splice(index, 1, preset.toJSON());

            config.set('presets', this.presets);
        },

        /**
         * Delete a preset
         * @param preset
         */
        deletePreset(preset: PresetInterface) {
            const index = _.findIndex(this.presets, {id: preset.id});
            this.presets.splice(index, 1);

            config.set('presets', this.presets);
        },

        /**
         * Set the currently selected preset
         * @param {string} id
         */
        setSelectedPreset(id: string) {
            this.selectedPresetId = id;
            config.set('selectedPreset', id);
        },

        /**
         * Save the presets to the config file
         */
        savePresets() {
            config.set('presets', this.presets);
        },
    },
});