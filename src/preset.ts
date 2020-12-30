import Step from '@/step';
import {v4 as uuidv4} from 'uuid';

export default class Preset {
    public id: string;
    public name: string;
    public steps: Array<Step>;

    constructor(name: string, steps: Array<Step> = []) {
        this.id = uuidv4();
        this.name = name;
        this.steps = steps;
    }

    static fromJSON(json: Record<string, unknown>): Preset {
        const steps = (json.steps as Record<string, unknown>[]).map((json) => {
            return Step.fromJSON(json);
        });
        const preset = new Preset(json.name as string, steps);

        // Reset the id
        preset.id = json.id as string;

        return preset;
    }
}