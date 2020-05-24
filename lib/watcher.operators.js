"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.splitLines = void 0;
const rxjs_1 = require("rxjs");
exports.splitLines = () => {
    return (source) => {
        return new rxjs_1.Observable(subscriber => {
            let buffer = '';
            let lineNo = 0;
            const subscription = source.subscribe({
                next: value => {
                    if (value) {
                        buffer = `${buffer}${value}`;
                        const lines = buffer.split('\n');
                        buffer = lines.pop() || '';
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
};
//# sourceMappingURL=watcher.operators.js.map