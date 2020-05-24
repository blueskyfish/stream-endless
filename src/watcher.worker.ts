import { FSWatcher, WatchOptions } from 'chokidar';
import { Stats } from "fs";
import { WatcherObservable } from './watcher.observable';

/**
 * The Worker is the interface for monitoring file changes.
 *
 * It is use the module [**chokidar**](https://github.com/paulmillr/chokidar)
 */
export class WatcherWorker {

  private readonly mapper: Map<string, WatcherObservable> = new Map<string, WatcherObservable>();

  private readonly watcher: FSWatcher;

  constructor() {
    const watchOptions: WatchOptions = {
      alwaysStat: true,
    }

    this.watcher = new FSWatcher(watchOptions);

    this.watcher
      .on('add', async (filename: string, stats: Stats) =>
        await this.onWatcherInit(filename, stats)
      )
      .on('change', async (filename: string, stats: Stats) =>
        await this.onWatcherChange(filename, stats)
      )
      .on('unlink', async (filename: string) => await this.onWatchRemove(filename));
  }

  startWatch(watcher: WatcherObservable): void {
    this.mapper.set(watcher.filename, watcher);
    this.watcher.add(watcher.filename);
  }

  closeWatch(watcher: WatcherObservable): void {
    if (this.mapper.has(watcher.filename)) {
      this.mapper.delete(watcher.filename);
    }
  }

  async close(): Promise<void> {
    for (const watcher of this.mapper.values()) {
      watcher.close();
    }
     await this.watcher.close();
  }

  private async onWatcherInit(filename: string, stats: Stats): Promise<void> {
    const watcher = this.getWatcher(filename);
    if (watcher) {
      await watcher.onInit(stats);
    }
  }

  private async onWatcherChange(filename: string, stats: Stats): Promise<void> {
    const watcher = this.getWatcher(filename);
    if (watcher) {
      await watcher.onChange(stats);
    }
  }

  private async onWatchRemove(filename: string): Promise<void> {
    const watcher = this.getWatcher(filename);
    if (watcher) {
      await watcher.onRemove();
    }
  }

  private getWatcher(filename: string): WatcherObservable | null {
    return this.mapper.get(filename) || null
  }
}
