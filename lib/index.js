"use strict";
const command_1 = require("@oclif/command");
const watcher_operators_1 = require("./watcher.operators");
const watcher_service_1 = require("./watcher.service");
const toEncoding = (encoding) => {
    switch ((encoding || '').toLowerCase()) {
        case 'utf8':
        case 'utf-8':
        default:
            return 'utf8';
        case 'latin1':
            return 'ascii';
    }
};
let WatcherCommand = (() => {
    class WatcherCommand extends command_1.Command {
        async run() {
            const { args, flags } = this.parse(WatcherCommand);
            this.log('>');
            this.log('> 📁 %s (%s): %s', this.config.bin, this.config.version, WatcherCommand.description);
            this.log('>');
            if (!args.file) {
                this.error('> Error: "filename" is required');
                this.exit(-1);
            }
            const service = new watcher_service_1.WatcherService();
            const observer = service.add(args.file, {
                encoding: toEncoding(flags.encoding),
                fromPosition: flags.from
            });
            const subscription$ = observer.start()
                .pipe(watcher_operators_1.splitLines())
                .subscribe((line) => {
                this.log('> %s: %s', line.index, line.text);
            });
            const existHandler = (code) => {
                observer.close();
                subscription$.unsubscribe();
                process.exit(code);
            };
            process.on('SIGINT', () => existHandler());
            process.on('SIGUSR1', () => existHandler());
            process.on('SIGUSR2', () => existHandler());
            process.on('uncaughtException', () => existHandler());
        }
    }
    WatcherCommand.description = 'Watch file changes and delivery the file content like tail';
    WatcherCommand.flags = {
        version: command_1.flags.version({ char: 'v' }),
        help: command_1.flags.help({ char: 'h' }),
        from: command_1.flags.integer({ char: 'n', description: 'Position (default from end of file)', default: -1 }),
        encoding: command_1.flags.string({ char: 'e', description: 'The file encoding (default "utf8")', default: 'uft8' }),
    };
    WatcherCommand.args = [
        {
            name: 'file',
            description: 'The watching file',
            required: true,
        }
    ];
    WatcherCommand.examples = [
        '$ endless test.log',
        '$ endless -n 1024 test.log',
        '$ endless --encoding=latin1 test.log',
        '$ endless --from=2048 -e latin1 test.log'
    ];
    return WatcherCommand;
})();
module.exports = WatcherCommand;
//# sourceMappingURL=index.js.map