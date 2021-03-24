import Config from 'electron-store';
import _ from 'lodash';

const isDevelopment = process.env.NODE_ENV !== 'production';

const config = new Config({
    name: isDevelopment ? 'config-dev' : 'config',
    migrations: {
        '0.2.0': config => {
            const allSteps: Array<Record<string, unknown>> = [];
            const presets = config.get('presets') as Array<Record<string, unknown>>;

            _.forEach(presets, (preset) => {
                const steps = preset.steps as Array<Record<string, unknown>>;
                allSteps.push(...steps);
                preset.steps = steps.map((step) => {
                    return step.id;
                });
            });

            config.set('presets', presets);
            config.set('steps', allSteps);
        },
    },
});

export default config;