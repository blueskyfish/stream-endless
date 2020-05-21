import { Observable } from 'rxjs';
import { WatcherWorker } from './watcher.worker';
import { WatcherObservable } from './watcher.observable';

export class WatcherService {

  private readonly watcher: WatcherWorker;

  constructor() {
    this.watcher = new WatcherWorker();
  }

  /**
   * Add an file for watch the change
   * @param {string} filename
   * @returns {Observable<string>}
   */
  add(filename: string): WatcherObservable {
    return new WatcherObservable(filename, this.watcher);
  }

  startWatch(filename: string) {
  }


}
