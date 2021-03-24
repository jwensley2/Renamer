import Step from '@/step';
import {v4 as uuidv4} from 'uuid';

export interface PresetConfig {
    id: string,
    name: string,
    steps: Array<string>,
}

export default class Preset {
    public id: string;
    public name: string;
    public steps: Array<Step>;

    constructor(name: string, steps: Array<Step> = []) {
        this.id = uuidv4();
        this.name = name;
        this.steps = steps;
    }

    public toJSON(): PresetConfig {
        return {
            id: this.id,
            name: this.name,
            steps: this.steps.map((step) => {
                return step.id;
            }),
        };
    }

    static fromJSON(json: PresetConfig): Preset {
        const preset = new Preset(json.name as string);

        // Reset the id
        preset.id = json.id as string;

        return preset;
    }
}