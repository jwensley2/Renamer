import {Transformer} from '@/transformers/transformer';
import SelectedFile, {Part} from '@/file';

export type Options = {
    part: Part,
    search: string | RegExp,
    replace: string
    regex: boolean,
    caseInsensitive: boolean,
};

export class Replace implements Transformer {
    private options: Options;
    private defaults: Options = {
        part: Part.Name,
        search: '',
        replace: '',
        regex: false,
        caseInsensitive: true,
    };

    constructor(options: Options) {
        this.options = Object.assign(this.defaults, options);
    }

    transform(file: SelectedFile): void {
        const part = this.options.part;
        let search;
        if (this.options.regex) {
            search = new RegExp(this.options.search, 'g');
        } else {
            search = this.options.search;
        }

        file.setPart(part, file.getPart(part).replaceAll(search, this.options.replace));
    }

    defaultOptions(): Record<string, unknown> {
        return this.defaults;
    }
}