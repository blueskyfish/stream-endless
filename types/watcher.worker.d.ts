import { WatcherObservable } from './watcher.observable';
export declare class WatcherWorker {
    private readonly mapper;
    private readonly watcher;
    constructor();
    startWatch(watcher: WatcherObservable): void;
    closeWatch(watcher: WatcherObservable): void;
    close(): Promise<void>;
    private onWatcherInit;
    private onWatcherChange;
    private onWatchRemove;
    private getWatcher;
}
