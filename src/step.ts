import {TransformerFactory, TransformerType} from '@/transformers/transformer';
import SelectedFile from '@/file';
import {v4 as uuidv4} from 'uuid';

export default class Step {
    public id;
    public active = true;
    public label: string;
    public transformer: TransformerType;
    public options = {};
    public draggedOver = false;

    constructor(label: string, transformer: TransformerType, options: Record<string, unknown> = {}) {
        this.id = uuidv4();
        this.label = label;
        this.transformer = transformer;
        this.options = this.mergeOptionsWithDefaults(options);
    }

    static fromJSON(json: Record<string, unknown>): Step {
        const step = new Step(json.label as string, json.transformer as TransformerType, json.options as Record<string, unknown>);
        step.id = json.id as string;
        step.active = json.active as boolean;

        return step;
    }

    public applyStep(file: SelectedFile): void {
        const transformer = TransformerFactory.makeTransformer(this.transformer, this.options);

        transformer.transform(file);
    }

    public mergeOptionsWithDefaults(options = {}): Record<string, unknown> {
        const transformer = TransformerFactory.makeTransformer(this.transformer, {});
        return Object.assign({}, transformer.defaultOptions(), options);
    }
}