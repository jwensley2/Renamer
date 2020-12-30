import {Transformation} from '@/transformations/transformation';
import SelectedFile, {Part} from '@/file';

export enum Case {
    Lowercase = 'Lowercase',
    Uppercase = 'Uppercase',
    TitleCase = 'TitleCase',
}

export function caseLabel(textCase: Case): string {
    switch (textCase) {
        case Case.Uppercase:
            return 'Uppercase';
        case Case.TitleCase:
            return 'Title Case';
        default:
            return 'Lowercase';
    }
}

export type Options = {
    part: Part,
    case: Case
}

export class ChangeCase implements Transformation {
    private options: Options;
    private defaults: Options = {
        part: Part.Name,
        case: Case.Lowercase,
    };

    constructor(options: Options) {
        this.options = Object.assign(this.defaults, options);
    }

    transform(file: SelectedFile): void {
        const part = this.options.part;

        switch (this.options.case) {
            case Case.Lowercase:
                file.setPart(part, file.getPart(part).toLowerCase());
                break;
            case Case.Uppercase:
                file.setPart(part, file.getPart(part).toUpperCase());
                break;
            case Case.TitleCase:
                file.setPart(part, file.getPart(part).replaceAll(/(\s([a-z])|^([a-z]))/g, (match) => {
                    return match.toUpperCase();
                }));
                break;
        }
    }
}