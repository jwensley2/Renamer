import {Transformer} from '@/transformers/transformer';
import SelectedFile, {Part} from '@/file';

type Replacement = {
    search: string,
    replace: string,
    regex: boolean,
    caseInsensitive: boolean
}

export type Options = {
    part: Part,
    replacements: Array<Replacement>
};

export class ReplaceList implements Transformer {
    private options: Options;
    private defaults: Options = {
        part: Part.Name,
        replacements: [],
    };

    constructor(options: Options) {
        this.options = Object.assign(this.defaults, options);
    }

    transform(file: SelectedFile): void {
        const part = this.options.part;

        this.options.replacements.forEach((replacement) => {
            let search;

            if (replacement.regex) {
                let flags = 'g';

                if (replacement.caseInsensitive) {
                    flags += 'i';
                }

                search = new RegExp(replacement.search, flags);
            } else {
                search = replacement.search;
            }

            file.setPart(part, file.getPart(part).replaceAll(search, replacement.replace || ''));
        });
    }
}