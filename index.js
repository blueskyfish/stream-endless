/**
 * Stream Endless - https://github.com/blueskyfish/stream-endless.git
 * 
 * The MIT License (MIT)
 * 
 * Copyright (c) 2017 BlueSkyFish
 */

const fs = require('fs');
const {Readable, Writable} = require('stream');
const path = require('path');


class ConsoleStreamWriter extends Writable {

	constructor() {
		super({objectMode: true});
	}

	_write(line, encoding, done) {
		if (line) {
			console.log('%s [%s] %s', line.name, line.line, line.text);
		}
		done();
	}
}

class EndlessStreamReader extends Readable {

	constructor(pathname, stats, readFromPosition = -1) {
		super({objectMode: true})

		this.pathname = pathname;
		this.stats = stats;
		this.fd = false;
		this.buffer = '';

		this.lineNumber = 0;
		this.lineSeparator = /[\r]{0,1}\n/;

		if (readFromPosition > 0) {
			this.position = stats.size - readFromPosition;
		} if (readFromPosition === 0) {
			this.position = 0;
		} else {
			this.position = stats.size;
		}
	}

	_read() {
	}

	onChanged(stats) {
		const _that = this;

		_that._getFileDescriptor()
			.then((fd) => {
				if (!fd) {
					return _that.push(null);
				}
				const position = (_that.position <= stats.size) ? _that.position : 0
				const size = stats.size - position;
				const buffer = Buffer.alloc(size, 0, 'utf8');
				fs.read(fd, buffer, 0, size, _that.position, (err, readOfBytes) => {
					if (err) {
						return;
					}
					_that.buffer += buffer.toString('utf8', 0, readOfBytes);
					const parts = _that.buffer.split(_that.lineSeparator);
					_that.buffer = parts.pop();
					_that.position = stats.size;

					for (let i = 0; i < parts.length; i++) {
						const data = {
							name: path.basename(_that.pathname),
							line: ++_that.lineNumber,
							text: parts[i]
						}
						_that.push(data);
					}
				});
			}, (reason) => {
				console.warn(reason);
				_that.push(null);
			});
	}

	_getFileDescriptor() {
		const _that = this;
		return new Promise((resolve, reject) => {
			if (this.fd === false) {
				// open the file
				fs.open(_that.pathname, 'r', (err, fd) => {
					if (err) {
						this.fd = null;
						return reject({
							pathname: _that.pathname,
							message: 'file not found'
						});
					}
					_that.fd = fd;
					resolve(_that.fd);
				});
				return;
			}
			if (this.fd === null) {
				// file not exist
				return reject({
					pathname: _that.pathname,
					message: 'file not found'
				});
			}
			resolve(_that.fd);
		});
	}
}


const FSWatcher = require('chokidar').FSWatcher;

const fsWatcher = new FSWatcher({
	alwaysStat: true
});

const writer = new ConsoleStreamWriter();

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

fsWatcher.add('./test.log');

setInterval(() => {
}, 1000);
