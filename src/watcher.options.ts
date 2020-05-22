/**
 * The watcher options for a file
 */
export interface IWatcherOptions {

  /**
   * The encoding of the file
   */
  encoding: BufferEncoding;

  /**
   * From the position reading.
   *
   * * `0`
   */
  fromPosition: number;
}

export const DEFAULT_OPTIONS: IWatcherOptions = {
  encoding: 'utf8',
  fromPosition: 0
};
