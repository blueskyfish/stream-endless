/// <reference types="node" />
import { Stats } from 'fs';
import { Observable } from 'rxjs';
import { IWatcherOptions } from './watcher.options';
import { WatcherWorker } from './watcher.worker';
export declare class WatcherObservable {
    readonly filename: string;
    private readonly worker;
    private readonly file;
    private readonly subject;
    constructor(filename: string, options: IWatcherOptions, worker: WatcherWorker);
    onInit(stats: Stats): Promise<void>;
    onChange(stats: Stats): Promise<void>;
    onRemove(): Promise<void>;
    start(): Observable<string>;
    close(): void;
}
