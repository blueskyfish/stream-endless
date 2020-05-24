/**
 * The watcher options for a file
 */
export interface IWatcherOptions {

  /**
   * The encoding of the file (default is `utf8`)
   */
  encoding: BufferEncoding;

  /**
   * From the position reading (default is `-1`)
   *
   * * &lt; `0` From the end of the file (`file.size`)
   * * `0` from the beginning of the file
   * * &gt; `0` from the end position (`file.size - fromPosition`)
   */
  fromPosition: number;
}

/**
 * Default watch option with `utf8` and reading from `file.size`
 * @type {IWatcherOptions}
 */
export const DEFAULT_OPTIONS: IWatcherOptions = {
  encoding: 'utf8',
  fromPosition: -1
};
