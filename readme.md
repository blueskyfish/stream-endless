
# Stream Endless

> A small demo how to read a text file endless

This is a Demo to read a text file. It use the nodejs module [Chokidar from Paul Miller](https://github.com/paulmillr/chokidar)

## How it work

The FSWatcher collects the file for watching. If the event **add** is received it create a `EndlessStreamReader` that pipe to an `ConsoleStreamWriter`.

```js
const FSWatcher = require('chokidar').FSWatcher;

const fsWatcher = new FSWatcher({
	alwaysStat: true
});

const writer = new ConsoleStreamWriter();

// map with the all file for watching
const _cache = {};

fsWatcher
	.on('add', (pathname, stats) => {
		const reader = new EndlessStreamReader(pathname, stats);
		reader.pipe(writer);

		_cache[pathname] = reader;
	})
	.on('change', (pathname, stats) => {
		const reader = _cache[pathname];
		if (reader) {
			reader.onChanged(stats);
		}
	});

// add the file for watching
fsWatcher.add('./test.log');
```


## License

```txt
Copyright 2017 BlieSkyFish

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