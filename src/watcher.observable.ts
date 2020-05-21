import { Stats } from 'fs';
import { BehaviorSubject, EMPTY, Observable } from 'rxjs';
import { WatcherWorker } from './watcher.worker';

export class WatcherObservable {

  private subject: BehaviorSubject<string> = new BehaviorSubject<string>('');

  constructor(public readonly filename: string, private readonly worker: WatcherWorker) {
  }

  onAdd(stats: Stats): void {

  }

  onChange(stats: Stats): void {

  }

  onRemove(): void {

  }

  start(): Observable<string> {
    this.worker.startWatch(this);
    return this.subject.asObservable();
  }

  close(): void {
    this.worker.closeWatch(this);
  }
}
