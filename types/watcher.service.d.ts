import { IWatcherOptions } from './watcher.options';
import { WatcherObservable } from './watcher.observable';
export declare class WatcherService {
    private readonly watcher;
    constructor();
    add(filename: string, options?: IWatcherOptions): WatcherObservable;
    close(): Promise<void>;
}
