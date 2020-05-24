import { Observable } from 'rxjs';
export interface IWatcherLiner {
    index: number;
    text: string;
}
export declare const splitLines: () => (source: Observable<string>) => Observable<IWatcherLiner>;
