/// <reference types="node" />
import { Stats } from 'fs';
import { IWatcherOptions } from './watcher.options';
export declare class FileHandle {
    private readonly filename;
    private options;
    private position;
    private ino;
    private fd;
    constructor(filename: string, options: IWatcherOptions);
    initFile(stats: Stats): Promise<string>;
    changeFile(stats: Stats): Promise<string>;
    private readFile;
    private openFile;
    closeFile(): Promise<void>;
}
