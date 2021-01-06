import {Transformer} from '@/transformers/transformer';
import SelectedFile from '@/file';
import _ from 'lodash';
import path from 'path';

export type Options = {
    template: string,
}

export class Rename implements Transformer {
    private options: Options;
    private defaults: Options = {
        template: '${ name }',
    };

    constructor(options: Options) {
        this.options = Object.assign(this.defaults, options);
    }

    transform(file: SelectedFile): void {
        const template = _.template(this.options.template);

        file.renamedName = template({
            directory: file.dir,
            directories: file.dir.split(path.sep).reverse(),
            name: file.name,
            ext: file.ext.slice(1),
        });
    }

    defaultOptions(): Record<string, unknown> {
        return this.defaults;
    }

    static getTemplateVariables(): string[] {
        return [
            'name',
            'ext',
            'directory',
            'directories[0]',
            'directories[1]',
            'directories[2]',
            'directories[3]',
            'directories[4]',
            'directories[5]',
            'directories[6]',
            'directories[7]',
            'directories[8]',
            'directories[9]',
        ];
    }
}