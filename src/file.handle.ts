import { close as fileClose, open as fileOpen, read as fileRead, Stats } from 'fs';
import { IWatcherOptions } from './watcher.options';

export class FileHandle {

  private position: number = -1;

  /**
   * The **Inode** number for the file.
   */
  private ino: number = 0;

  private fd: number = 0;

  constructor(
    private readonly filename: string,
    private options: IWatcherOptions
  ) {
  }

  async initFile(stats: Stats): Promise<string> {
    await this.openFile(stats.ino);

    if (this.options.fromPosition === 0) {
      this.position = stats.size;
    } else if (this.options.fromPosition > 0) {
      this.position = stats.size - this.options.fromPosition;
    } else {
      this.position = 0;
    }

    if (this.position < stats.size) {
      return await this.readFile(stats);
    }

    return Promise.resolve(null);
  }

  async changeFile(stats: Stats): Promise<string> {
    await this.openFile(this.ino);
    return await this.readFile(stats);
  }

  private async readFile(stats: Stats): Promise<string> {
    if (this.fd < 0) {
      return Promise.reject({ message: 'File is not open' });
    }

    return new Promise<string>(((resolve, reject) => {

      const encoding: BufferEncoding = this.options.encoding || 'utf8';
      const position: number = (this.position <= stats.size) ? this.position : 0;
      const size: number = stats.size - position;
      const buffer = Buffer.alloc(size, 0, encoding);

      fileRead(this.fd, buffer, 0, size, position, (err, bytesOfRead: number, buffer: Buffer) => {
        if (err) {
          return reject(err);
        }

        this.position = stats.size;
        const value: string = buffer.toString(encoding, 0, bytesOfRead);
        resolve(value);
      });
    }));
  }

  private async openFile(ino: number): Promise<void> {
    if (this.ino !== ino) {
      this.ino = ino;
      // close the file description if open
      await this.closeFile();
    }
    if (this.fd === 0) {
      // open file description
      return new Promise<void>(((resolve, reject) => {
        fileOpen(this.filename, 'r', ((err, fd) => {
          if (err) {
            this.fd = -1;
            return reject(err);
          }
          this.fd = fd;
          resolve();
        }));
      }));
    } else if (this.fd > 0) {
      // file descriptor is already open
      return Promise.resolve();
    } else {
      return Promise.reject({ message: `Could not open file ${this.filename}` });
    }
  }

  async closeFile(): Promise<void> {
    if (this.fd > 0) {
      return new Promise<void>((resolve, reject) => {
        fileClose(this.fd, (err) => {
          if (err) {
            return reject(err);
          }

          this.fd = 0;

          resolve();
        });
      });
    }
    return Promise.resolve();
  }
}
