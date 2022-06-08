import Config from 'electron-store';
import _ from 'lodash';
import {StepConfig} from '@/step';
import {TransformerType} from '@/transformers/transformer';
import {Options as ReplaceOptions} from '@/transformers/replace-list';
import {v4 as uuidv4} from 'uuid';

const isProduction = process.env.NODE_ENV === 'production';

const config = new Config({
    name: isProduction ? 'config' : `config-${process.env.NODE_ENV}`,
    migrations: {
        '0.2.0': config => {
            const allSteps: Array<StepConfig> = [];
            const presets = config.get('presets') as Array<Record<string, unknown>> ?? [];

            _.forEach(presets, (preset) => {
                const steps = preset.steps as Array<StepConfig>;
                allSteps.push(...steps);
                preset.steps = steps.map((step) => {
                    return step.id;
                });
            });

            // Set ids for replace list transformer replacements
            _.forEach(allSteps, (step) => {
                if (step.transformer === TransformerType.ReplaceList) {
                    const options = step.options as ReplaceOptions;

                    _.forEach(options.replacements, (replacement) => {
                        replacement.id = uuidv4();
                    });
                }
            });

            config.set('presets', presets);
            config.set('steps', allSteps);
        },
    },
});

export default config;