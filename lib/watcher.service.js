"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WatcherService = void 0;
const watcher_options_1 = require("./watcher.options");
const watcher_worker_1 = require("./watcher.worker");
const watcher_observable_1 = require("./watcher.observable");
class WatcherService {
    constructor() {
        this.watcher = new watcher_worker_1.WatcherWorker();
    }
    add(filename, options = watcher_options_1.DEFAULT_OPTIONS) {
        return new watcher_observable_1.WatcherObservable(filename, options, this.watcher);
    }
    async close() {
        await this.watcher.close();
    }
}
exports.WatcherService = WatcherService;
//# sourceMappingURL=watcher.service.js.map