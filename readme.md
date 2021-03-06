
[![Endless Core](logo.png)](#logo)

# Endless Core

> Watch file changes and delivery the file content like tail

## Overview

![Components](assets/components.png)

The **WatcherService** is the front to monitor file changes.

```ts
/*     */ import { IWatcherLiner, splitLines, WatcherService, WatcherObservable } from 'endless-core';
/*     */
/*     */ const watcherService: WatcherService = ...
/*     */ const filename = ...
/* (1) */ const watcher$: WatcherObservable = watcherService.add(filename, { encoding: 'utf8', fromPosition: 1024});
/*     */
/* (2) */ watcher$.start()
/*     */  .pipe(
/*     */    splitLines(),
/*     */  )
/*     */  .subscribe((line: IWatcherLiner) => {
/*     */    console.log('%s: %s', line.index, line.text);
/*     */   });
/*     */
/*     */
/* (3) */ watcher$.close();
```
* (1) With "add" a **WatcherObservable** is created, which reads the file as UTF-8 and starts at the position 1024 bytes from the end.<br>
    The **watcherWorker** manages the file and notify the changes to the observable
* (2) Start watching and split the output into line.
* (3) Close observer and stop watching


## License

```txt
Copyright 2017 - 2020 Blueskyfish

Permission is hereby granted, free of charge, to any person obtaining a copy of
this software and associated documentation files (the "Software"), to deal in
the Software without restriction, including without limitation the rights to use,
copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the
Software, and to permit persons to whom the Software is furnished to do so,
subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED,
INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A
PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
```

## Logo

Icon Experience: <https://www.iconexperience.com/>
