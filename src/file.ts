import Step from '@/step';
import _ from 'lodash';
import path from 'path';
import fs from 'fs';
import {v4 as uuidv4} from 'uuid';
import process from 'process';

export enum Part {
    Name = 'Name',
    Extension = 'Extension'
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

    /**
     * Check if the file can be renamed. If it exists and there are no conflicts, permission issues, etc.
     */
    public canRename(): [boolean, string | null] {
        if (!fs.existsSync(this.path)) {
            return [false, 'File does not exist'];
        }

        if (fs.existsSync(this.renamedPath)) {
            // Windows is case insensitive, so we can rename if only the case is changing
            if ((process.platform === 'win32') && this.path.toLowerCase() === this.renamedPath.toLowerCase()) {
                return [true, null];
            }

            return [false, 'Renamed file already exists'];
        }

        try {
            fs.accessSync(this.path, fs.constants.W_OK);
        } catch (error) {
            return [false, 'Cannot write original path'];
        }

        try {
            fs.accessSync(this.renamedDir, fs.constants.W_OK);
        } catch (error) {
            return [false, 'Cannot write to new path'];
        }

        return [true, null];
    }

    public rename(): void {
        this.error = null;

        // Skip files that haven't changed
        if (this.path === this.renamedPath) return;

        const [canRename, error] = this.canRename();

        if (!canRename) {
            this.error = error;
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