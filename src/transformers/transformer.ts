import SelectedFile from '@/file';
import {Options as ReplaceOptions, Replace} from '@/transformers/replace';
import {ChangeCase, Options as ChangeCaseOptions} from '@/transformers/change-case';
import {Options as ReplaceListOptions, ReplaceList} from '@/transformers/replace-list';
import {Options as TrimOptions, Trim} from '@/transformers/trim';
import {Options as RenameOptions, Rename} from '@/transformers/rename';

export enum TransformerType {
    ChangeCase = 'ChangeCase',
    Replace = 'Replace',
    ReplaceList = 'ReplaceList',
    Trim = 'Trim',
    Rename = 'Rename',
}

export type TransformerOptions = Record<string, unknown>;

export function label(transformation: TransformerType): string {
    switch (transformation) {
        case TransformerType.Replace:
            return 'Replace';
        case TransformerType.ReplaceList:
            return 'Replace List';
        case TransformerType.ChangeCase:
            return 'Change Case';
        case TransformerType.Trim:
            return 'Trim';
    }

    return transformation;
}

export interface Transformer {
    transform(file: SelectedFile): void;

    defaultOptions(): TransformerOptions;
}

export class TransformerFactory {
    static makeTransformer(type: TransformerType, options: TransformerOptions): Transformer {
        switch (type) {
            case TransformerType.Replace:
                return new Replace(options as ReplaceOptions);
            case TransformerType.ChangeCase:
                return new ChangeCase(options as ChangeCaseOptions);
            case TransformerType.ReplaceList:
                return new ReplaceList(options as ReplaceListOptions);
            case TransformerType.Trim:
                return new Trim(options as TrimOptions);
            case TransformerType.Rename:
                return new Rename(options as RenameOptions);
        }

        throw new Error('Unknown transformation type');
    }
}