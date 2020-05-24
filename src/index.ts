import { Command, flags } from '@oclif/command';
import { IWatcherLiner, splitLines } from './watcher.operators';
import { WatcherService } from './watcher.service';

const toEncoding = (encoding: string): BufferEncoding => {
  switch ((encoding || '').toLowerCase()) {
    case 'utf8':
    case 'utf-8':
    default:
      return 'utf8';
    case 'latin1':
      return 'ascii';
  }
}

class WatcherCommand extends Command {

  static description = 'Watch file changes and delivery the file content like tail';

  static flags = {
    version: flags.version({char: 'v'}),
    help: flags.help({char: 'h'}),
    from: flags.integer({char: 'n', description: 'Position (default from end of file)', default: -1}),
    encoding: flags.string({char: 'e', description: 'The file encoding (default "utf8")', default: 'uft8'}),
  };

  static args = [
    {
      name: 'file',
      description: 'The watching file',
      required: true,
    }
  ];

  static examples = [
    '$ endless test.log',
    '$ endless -n 1024 test.log',
    '$ endless --encoding=latin1 test.log',
    '$ endless --from=2048 -e latin1 test.log'
  ]

  async run(): Promise<any> {
    const {args, flags} = this.parse(WatcherCommand);

    this.log('>');
    this.log('> 📁 %s (%s): %s', this.config.bin, this.config.version, WatcherCommand.description);
    this.log('>');
    if (!args.file) {
      this.error('> Error: "filename" is required');
      this.exit(-1);
    }

    const service = new WatcherService();
    const observer = service.add(args.file, {
      encoding: toEncoding(flags.encoding),
      fromPosition: flags.from
    });

    const subscription$ = observer.start()
      .pipe(
        splitLines()
      )
      .subscribe((line: IWatcherLiner) => {
        this.log('> %s: %s', line.index, line.text);
      });

    const existHandler = (code?: number) => {
      observer.close();
      subscription$.unsubscribe();
      process.exit(code);
    }

    process.on('SIGINT', () => existHandler());
    process.on('SIGUSR1', () => existHandler());
    process.on('SIGUSR2', () => existHandler());
    process.on('uncaughtException', () => existHandler());
  }
}


export = WatcherCommand
