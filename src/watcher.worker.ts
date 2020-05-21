import { FSWatcher, WatchOptions } from 'chokidar';
import { Stats } from "fs";
import { WatcherObservable } from './watcher.observable';

export class WatcherWorker {

  private readonly mapper: Map<string, WatcherObservable> = new Map<string, WatcherObservable>();

  private readonly watcher: FSWatcher;

  constructor() {
    const watchOptions: WatchOptions = {
      alwaysStat: true,
    }

    this.watcher = new FSWatcher(watchOptions);

    this.watcher
      .on('add', (filename: string, stats: Stats) => this.onWatcherAdd(filename, stats))
      .on('change', (filename: string, stats: Stats) => this.onWatcherChange(filename, stats))
      .on('unlink', (filename: string) => this.onWatchRemove(filename));
  }

  startWatch(watcher: WatcherObservable): void {
    this.mapper.set(watcher.filename, watcher);
    this.watcher.add(watcher.filename);
  }

  closeWatch(watcher: WatcherObservable): void {

  }

  close(): void {

    for (const watcher of this.mapper.values()) {
      watcher.close();
    }
  }

  private onWatcherAdd(filename: string, stats: Stats): void {

  }

  private onWatcherChange(filename: string, stats: Stats): void {

  }

  private onWatchRemove(filename: string): void {

  }
}
