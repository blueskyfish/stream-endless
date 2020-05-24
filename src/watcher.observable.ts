import { Stats } from 'fs';
import { BehaviorSubject, EMPTY, Observable } from 'rxjs';
import { FileHandle } from './file.handle';
import { IWatcherOptions } from './watcher.options';
import { WatcherWorker } from './watcher.worker';

export class WatcherObservable {

  private readonly file: FileHandle;

  private readonly subject: BehaviorSubject<string> = new BehaviorSubject<string>('');

  /**
   * Create an file watcher observer.
   * @param {string} filename the file
   * @param {IWatcherOptions} options the options
   * @param {WatcherWorker} worker the worker
   */
  constructor(
    public readonly filename: string,
    options: IWatcherOptions,
    private readonly worker: WatcherWorker
  ) {
    this.file = new FileHandle(filename, options);
  }

  /**
   * Initialize the watching.
   *
   * **Note**: This public method is called by {@link WatcherWorker}. Don't call directly.
   */
  async onInit(stats: Stats): Promise<void> {
    const text = await this.file.initFile(stats);
    if (text) {
      this.subject.next(text);
    }
  }

  /**
   * The file is changed.
   *
   * **Note**: This public method is called by {@link WatcherWorker}. Don't call directly.
   */
  async onChange(stats: Stats): Promise<void> {
    const text = await this.file.changeFile(stats);
    if (text) {
      this.subject.next(text);
    }
  }

  /**
   * Remove the file from watching.
   *
   * **Note**: This public method is called by {@link WatcherWorker}. Don't call directly.
   */
  async onRemove(): Promise<void> {
    await this.file.closeFile();
  }

  /**
   * Starts to observe the file.
   * @returns {Observable<string>}
   */
  start(): Observable<string> {
    this.worker.startWatch(this);
    return this.subject.asObservable();
  }

  /**
   * It is complete the observable and remove the watch worker.
   */
  close(): void {
    this.worker.closeWatch(this);
    this.subject.complete();
  }
}
