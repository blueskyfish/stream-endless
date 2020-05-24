"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.line = void 0;
const rxjs_1 = require("rxjs");
exports.line = () => {
    return (source) => {
        return new rxjs_1.Observable(subscriber => {
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
};
//# sourceMappingURL=liner.operator.js.map