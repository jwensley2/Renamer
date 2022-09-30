import Step from '@/step';
import {v4 as uuidv4} from 'uuid';
import {SelectedFileInterface} from '@/file';
import _ from 'lodash';
import {useStepStore} from '@/stores/steps';

export interface PresetConfig {
    id: string;
    name: string;
    steps: string[];
}

export interface PresetInterface {
    id: string;
    name: string;
    steps: Step[];

    toJSON(): PresetConfig;
}

export default class Preset implements PresetInterface {
    public id: string;
    public name: string;
    public steps: Step[];

    constructor(name: string, steps: Step[] = []) {
        this.id = uuidv4();
        this.name = name;
        this.steps = steps;
    }

    public transformFiles(files: SelectedFileInterface[]): SelectedFileInterface[] {
        const stepStore = useStepStore();
        const steps = stepStore.getSteps(this.id, true);

        const transformed = files.map((file: SelectedFileInterface) => {
            if (!file.selected) {
                return file.transform([]);
            }

            return file.transform(steps);
        });

        this.suffixDuplicates(transformed);

        return transformed;
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

    /**
     * Find files where the renamed path is duplicated and add a suffix to prevent naming collisions
     *
     * @param files
     * @protected
     */
    protected suffixDuplicates(files: SelectedFileInterface[]): void {
        const duplicates: { [key: string]: SelectedFileInterface[] } = {};

        // Find files where the renamed path is duplicated
        files.forEach((file) => {
            const duplicate = _.find(files, (f) => {
                return f.path !== file.path && f.renamedPath === file.renamedPath;
            });

            if (duplicate) {
                if (!duplicates[file.renamedPath]) duplicates[file.renamedPath] = [];

                duplicates[file.renamedPath].push(file);
            }
        });

        // Add a suffix to the duplicate files
        _.each(duplicates, (files) => {
            files.forEach((file, index) => {
                file.renamedName = `${file.renamedName} ${index + 1}`;
            });
        });
    }
}