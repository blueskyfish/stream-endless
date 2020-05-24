import { Observable } from 'rxjs';

export interface IWatcherLiner {
  index: number;
  text: string;
}

/**
 * Split the string value into line by line
 *
 * @return {(source: Observable<string>) => Observable<IWatcherLiner>}
 */
export const splitLines = () => {
  return (source: Observable<string>) => {
    return new Observable<IWatcherLiner>(subscriber => {

      let buffer = '';
      let lineNo = 0;

      const subscription = source.subscribe({

        next: value => {

          if (value) {

            buffer = `${buffer}${value}`;

            const lines = buffer.split('\n');
            buffer = lines.pop() || '';

            // send index
            lines.forEach(text => subscriber.next({
              index: ++lineNo,
              text
            }));

          }
        },
        error: err => subscriber.error(err),
        complete: () => subscriber.complete()
      });

      return () => subscription.unsubscribe();
    });
  };
}
