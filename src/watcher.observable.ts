import { Stats } from 'fs';
import { BehaviorSubject, EMPTY, Observable } from 'rxjs';
import { FileHandle } from './file.handle';
import { IWatcherOptions } from './watcher.options';
import { WatcherWorker } from './watcher.worker';

export class WatcherObservable {

  private readonly file: FileHandle;

  private readonly subject: BehaviorSubject<string> = new BehaviorSubject<string>('');

  constructor(
    public readonly filename: string,
    options: IWatcherOptions,
    private readonly worker: WatcherWorker
  ) {
    this.file = new FileHandle(filename, options);
  }

  async onInit(stats: Stats): Promise<void> {
    const text = await this.file.initFile(stats);
    if (text) {
      this.subject.next(text);
    }
  }

  async onChange(stats: Stats): Promise<void> {
    const text = await this.file.changeFile(stats);
    if (text) {
      this.subject.next(text);
    }
  }

  async onRemove(): Promise<void> {
    await this.file.closeFile();
  }

  start(): Observable<string> {
    this.worker.startWatch(this);
    return this.subject.asObservable();
  }

  close(): void {
    this.worker.closeWatch(this);
  }
}
