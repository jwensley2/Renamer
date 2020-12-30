import {Transformation, TransformationTypes} from '@/transformations/transformation';
import {Options as ReplaceOptions, Replace} from '@/transformations/replace';
import {ChangeCase, Options as ChangeCaseOptions} from '@/transformations/change-case';
import SelectedFile from '@/file';
import {Options as ReplaceListOptions, ReplaceList} from '@/transformations/replace-list';
import {v4 as uuidv4} from 'uuid';

export default class Step {
    public id;
    public active = true;
    public label: string;
    public transformation: TransformationTypes;
    public options = {};
    public draggedOver = false;

    constructor(label: string, transformation: TransformationTypes, options: Record<string, unknown> = {}) {
        this.id = uuidv4();
        this.label = label;
        this.transformation = transformation;
        this.options = options;
    }

    static fromJSON(json: Record<string, unknown>): Step {
        const step = new Step(json.label as string, json.transformation as TransformationTypes, json.options as Record<string, unknown>);
        step.id = json.id as string;

        return step;
    }

    public applyStep(file: SelectedFile): void {
        const transformer = this.getTransformer();

        transformer.transform(file);
    }

    private getTransformer(): Transformation {
        switch (this.transformation) {
            case TransformationTypes.Replace:
                return new Replace(this.options as ReplaceOptions);
            case TransformationTypes.ChangeCase:
                return new ChangeCase(this.options as ChangeCaseOptions);
            case TransformationTypes.ReplaceList:
                return new ReplaceList(this.options as ReplaceListOptions);
        }

        throw new Error('Unknown transformation type');
    }
}