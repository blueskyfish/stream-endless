"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FileHandle = void 0;
const fs_1 = require("fs");
class FileHandle {
    constructor(filename, options) {
        this.filename = filename;
        this.options = options;
        this.position = -1;
        this.ino = 0;
        this.fd = 0;
    }
    async initFile(stats) {
        await this.openFile(stats.ino);
        if (this.options.fromPosition < 0) {
            this.position = stats.size;
        }
        else if (this.options.fromPosition > 0) {
            this.position = stats.size - this.options.fromPosition;
        }
        else {
            this.position = 0;
        }
        if (this.position < stats.size) {
            return await this.readFile(stats);
        }
        return Promise.resolve(null);
    }
    async changeFile(stats) {
        await this.openFile(this.ino);
        return await this.readFile(stats);
    }
    async closeFile() {
        if (this.fd > 0) {
            return new Promise((resolve, reject) => {
                fs_1.close(this.fd, (err) => {
                    if (err) {
                        return reject(err);
                    }
                    this.fd = 0;
                    resolve();
                });
            });
        }
        return Promise.resolve();
    }
    async readFile(stats) {
        if (this.fd < 0) {
            return Promise.reject({ message: 'File is not readable' });
        }
        return new Promise(((resolve, reject) => {
            const encoding = this.options.encoding || 'utf8';
            const position = (this.position <= stats.size) ? this.position : 0;
            const size = stats.size - position;
            const buffer = Buffer.alloc(size, 0, encoding);
            fs_1.read(this.fd, buffer, 0, size, position, (err, bytesOfRead, buffer) => {
                if (err) {
                    return reject(err);
                }
                this.position = stats.size;
                const value = buffer.toString(encoding, 0, bytesOfRead);
                resolve(value);
            });
        }));
    }
    async openFile(ino) {
        if (this.ino !== ino) {
            this.ino = ino;
            await this.closeFile();
        }
        if (this.fd === 0) {
            return new Promise(((resolve, reject) => {
                fs_1.open(this.filename, 'r', ((err, fd) => {
                    if (err) {
                        this.fd = -1;
                        return reject(err);
                    }
                    this.fd = fd;
                    resolve();
                }));
            }));
        }
        else if (this.fd > 0) {
            return Promise.resolve();
        }
        else {
            return Promise.reject({ message: `${this.filename} is not readable` });
        }
    }
}
exports.FileHandle = FileHandle;
//# sourceMappingURL=file.handle.js.map