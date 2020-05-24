import { Observable } from 'rxjs';
import { DEFAULT_OPTIONS, IWatcherOptions } from './watcher.options';
import { WatcherWorker } from './watcher.worker';
import { WatcherObservable } from './watcher.observable';

/**
 * The front to monitor file changes.
 */
export class WatcherService {

  private readonly watcher: WatcherWorker;

  constructor() {
    this.watcher = new WatcherWorker();
  }

  /**
   * Add an file for watch the change
   * @param {string} filename
   * @param {IWatcherOptions} options
   * @returns {Observable<string>}
   */
  add(filename: string, options: IWatcherOptions = DEFAULT_OPTIONS): WatcherObservable {
    return new WatcherObservable(filename, options, this.watcher);
  }

  async close(): Promise<void> {
    await this.watcher.close();
  }
}
