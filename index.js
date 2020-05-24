/**
 * Stream Endless - https://github.com/blueskyfish/stream-endless.git
 *
 * The MIT License (MIT)
 *
 * Copyright (c) 2017 BlueSkyFish
 */

const fs = require('fs');
const { Readable, Writable } = require('stream');
const path = require('path');

const { FSWatcher } = require('chokidar');

/**
 * @name LineData
 * @property {string} name the basename of the path
 * @property {number} index the index number
 * @property {string} text the index text.
 */


class ConsoleStreamWriter extends Writable {

  constructor() {
    super({ objectMode: true });
  }

  _write(line, encoding, done) {
    if (line) {
      console.log('%s [%s] %s', line.name, line.line, line.text);
    }
    done();
  }
}

/**
 * Endless stream reader reads the file on every change at the pathname.
 *
 * The class pipes to the next pipe element a object structure from type {@link LineData}.
 */
class EndlessStreamReader extends Readable {

  constructor(pathname, stats, readFromPosition = -1) {
    super({ objectMode: true });

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

	/**
	 * Try to process the file change.
	 * @param {fs.Stats} stats the file stats
	 */
  onChanged(stats) {
    if (stats && stats.size !== this.stats.size) {

      // get the file descriptor
      this._getFileDescriptor()
        .then((fd) => this._readFromFileDescriptor(stats, fd), (reason) => {
          console.warn('Error on get file description: ', reason);
          this.push(null);
        });
    }
  }

	/**
	 * Try to read the file change and push to the next pipe element
	 * @param {fs.Stats} stats
	 * @param {number} fd the file descriptor
	 * @private
	 */
  _readFromFileDescriptor(stats, fd) {
    if (!fd) {
      return this.push(null);
    }
    const position = (this.position <= stats.size) ? this.position : 0;
    const size = stats.size - position;
    const buffer = Buffer.alloc(size, 0, 'utf8');

    this.stats = stats;

    fs.read(fd, buffer, 0, size, this.position, (err, readOfBytes) => {
      if (err) {
        return;
      }
      this.buffer += buffer.toString('utf8', 0, readOfBytes);
      const parts = this.buffer.split(this.lineSeparator);
      this.buffer = parts.pop();
      this.position = stats.size;

      for (let i = 0; i < parts.length; i++) {
        /** @type {LineData} */
        const data = {
          name: path.basename(this.pathname),
          line: ++this.lineNumber,
          text: parts[i]
        };
        this.push(data);
      }
    });
  }

	/**
	 * Try to get the File Descriptor Id.
	 *
	 * @return {Promise<number>} the promise resolve the file descriptor id.
	 * @private
	 */
  _getFileDescriptor() {
    return new Promise((resolve, reject) => {
      if (this.fd === false) {
        // open the file
        // console.log('Open File: %s', this.pathname);
        fs.open(this.pathname, 'r', (err, fd) => {
          if (err) {
            this.fd = null;
            return reject({
              pathname: this.pathname,
              message: 'file not found'
            });
          }
          this.fd = fd;
          resolve(this.fd);
        });
        return;
      }
      if (this.fd === null) {
        // file not exist
        return reject({
          pathname: this.pathname,
          message: 'file not found'
        });
      }
      resolve(this.fd);
    });
  }
}


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
