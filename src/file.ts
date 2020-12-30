import Step from '@/step';
import _ from 'lodash';
import path from 'path';
import fs from 'fs';
import {v4 as uuidv4} from 'uuid';

export enum Part {
    Name,
    Extension
}

export default class SelectedFile {
    public id: string;

    public name: string;
    public renamedName: string;

    public ext: string;
    public renamedExt: string;

    public dir: string;
    public renamedDir: string;

    public error: string | null = null;

    constructor(filepath: string) {
        this.id = uuidv4();

        const parsed = path.parse(path.normalize(filepath));

        this.name = parsed.name;
        this.renamedName = parsed.name;

        this.ext = parsed.ext;
        this.renamedExt = parsed.ext;

        this.dir = parsed.dir;
        this.renamedDir = parsed.dir;
    }

    private reset() {
        this.renamedName = this.name;
        this.renamedExt = this.ext;
        this.renamedDir = this.dir;
    }

    get path(): string {
        return path.format({
            dir: this.dir,
            name: this.name,
            ext: this.ext,
        });
    }

    get renamedPath(): string {
        return path.format({
            dir: this.renamedDir,
            name: this.renamedName,
            ext: this.renamedExt,
        });
    }

    public transform(steps: Array<Step>): this {
        this.reset();

        steps.forEach((step) => {
            step.applyStep(this);
        });

        return this;
    }

    public getPart(part: Part): string {
        switch (part) {
            case Part.Extension:
                return this.renamedExt;
            default:
                return this.renamedName;
        }
    }

    public setPart(part: Part, value: string): void {
        switch (part) {
            case Part.Extension:
                this.renamedExt = value;
                break;
            default:
                this.renamedName = value;
                break;
        }
    }

    public rename(): void {
        this.error = null;

        // Skip files that haven't changed
        if (this.path === this.renamedPath) return;

        if (!fs.existsSync(this.path)) {
            this.error = 'File does not exist';
            return;
        }

        try {
            fs.renameSync(this.path, this.renamedPath);
        } catch (e) {
            if (_.startsWith(e.message, 'EBUSY')) {
                this.error = 'File in use';
                return;
            }

            this.error = 'Cannot rename file';
            return;
        }

        // Set the original name to be the new name
        this.name = this.renamedName;
        this.ext = this.renamedExt;
        this.dir = this.renamedDir;
    }
}