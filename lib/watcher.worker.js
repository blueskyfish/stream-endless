"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WatcherWorker = void 0;
const chokidar_1 = require("chokidar");
class WatcherWorker {
    constructor() {
        this.mapper = new Map();
        const watchOptions = {
            alwaysStat: true,
        };
        this.watcher = new chokidar_1.FSWatcher(watchOptions);
        this.watcher
            .on('add', async (filename, stats) => await this.onWatcherInit(filename, stats))
            .on('change', async (filename, stats) => await this.onWatcherChange(filename, stats))
            .on('unlink', async (filename) => await this.onWatchRemove(filename));
    }
    startWatch(watcher) {
        this.mapper.set(watcher.filename, watcher);
        this.watcher.add(watcher.filename);
    }
    closeWatch(watcher) {
        if (this.mapper.has(watcher.filename)) {
            this.mapper.delete(watcher.filename);
        }
    }
    async close() {
        for (const watcher of this.mapper.values()) {
            watcher.close();
        }
        await this.watcher.close();
    }
    async onWatcherInit(filename, stats) {
        const watcher = this.getWatcher(filename);
        if (watcher) {
            await watcher.onInit(stats);
        }
    }
    async onWatcherChange(filename, stats) {
        const watcher = this.getWatcher(filename);
        if (watcher) {
            await watcher.onChange(stats);
        }
    }
    async onWatchRemove(filename) {
        const watcher = this.getWatcher(filename);
        if (watcher) {
            await watcher.onRemove();
        }
    }
    getWatcher(filename) {
        return this.mapper.get(filename) || null;
    }
}
exports.WatcherWorker = WatcherWorker;
//# sourceMappingURL=watcher.worker.js.map