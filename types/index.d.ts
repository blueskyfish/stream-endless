import { Command, flags } from '@oclif/command';
declare class WatcherCommand extends Command {
    static description: string;
    static flags: {
        version: import("@oclif/parser/lib/flags").IBooleanFlag<void>;
        help: import("@oclif/parser/lib/flags").IBooleanFlag<void>;
        from: import("@oclif/parser/lib/flags").IOptionFlag<number>;
        encoding: flags.IOptionFlag<string>;
    };
    static args: {
        name: string;
        description: string;
        required: boolean;
    }[];
    static examples: string[];
    run(): Promise<any>;
}
export = WatcherCommand;
