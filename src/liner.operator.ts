import { Observable } from 'rxjs';

/**
 * Split the string value into line by line
 *
 * @return {(source: Observable<string>) => Observable<string>}
 */
export const line = () => {
  return (source: Observable<string>) => {
    return new Observable<string>(subscriber => {

      const subscription = source.subscribe({
        next: value => {
          if (value) {
            const lines = value.split('\n');
            lines.forEach(line => subscriber.next(line));
          }
        },
        error: err => subscriber.error(err),
        complete: () => subscriber.complete()
      });

      return () => subscription.unsubscribe();
    });
  };
}
