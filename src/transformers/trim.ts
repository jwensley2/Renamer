import {Transformer} from '@/transformers/transformer';
import SelectedFile, {Part} from '@/file';
import _ from 'lodash';

export type Options = {
    part: Part,
    characters: undefined | string,
}

export class Trim implements Transformer {
    private options: Options;
    private defaults: Options = {
        part: Part.Name,
        characters: undefined,
    };

    constructor(options: Options) {
        this.options = Object.assign(this.defaults, options);
    }

    transform(file: SelectedFile): void {
        const part = this.options.part;

        file.setPart(part, _.trim(file.getPart(part), this.options.characters));
    }
}