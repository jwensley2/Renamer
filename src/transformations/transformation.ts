import SelectedFile from '@/file';
import {Case} from '@/transformations/change-case';

export enum TransformationTypes {
    ChangeCase = 'ChangeCase',
    Replace = 'Replace',
    ReplaceList = 'ReplaceList',
}

export function label(transformation: TransformationTypes): string {
    switch (transformation) {
        case TransformationTypes.Replace:
            return 'Replace';
        case TransformationTypes.ReplaceList:
            return 'Replace List';
        case TransformationTypes.ChangeCase:
            return 'Change Case';
    }

    throw new Error('Label not defined for transformation ' + transformation);
}

export interface Transformation {
    transform(file: SelectedFile): void;
}