"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WatcherObservable = void 0;
const rxjs_1 = require("rxjs");
const file_handle_1 = require("./file.handle");
class WatcherObservable {
    constructor(filename, options, worker) {
        this.filename = filename;
        this.worker = worker;
        this.subject = new rxjs_1.BehaviorSubject('');
        this.file = new file_handle_1.FileHandle(filename, options);
    }
    async onInit(stats) {
        const text = await this.file.initFile(stats);
        if (text) {
            this.subject.next(text);
        }
    }
    async onChange(stats) {
        const text = await this.file.changeFile(stats);
        if (text) {
            this.subject.next(text);
        }
    }
    async onRemove() {
        await this.file.closeFile();
    }
    start() {
        this.worker.startWatch(this);
        return this.subject.asObservable();
    }
    close() {
        this.worker.closeWatch(this);
    }
}
exports.WatcherObservable = WatcherObservable;
//# sourceMappingURL=watcher.observable.js.map