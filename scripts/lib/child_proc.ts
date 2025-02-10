//-- NodeJS
import child_process from 'node:child_process';
import {Readable, Writable} from 'node:stream';

/**
 * A child process.
 */
export interface ChildProcess {
    /**
     * The command that was spawned.
     */
    readonly command: string;

    /**
     * The arguments that were passed to the command that was spawned.
     */
    readonly arguments: readonly string[];

    /**
     * Whether the child process is running.
     */
    readonly isRunning: boolean;

    /**
     * The process ID of the child process.
     *
     * Will be `null` if the child process is not running or has finished
     * running.
     */
    readonly pid: number | null;

    /**
     * The code the child process exited with.
     *
     * Will be `null` if the child process has not exited yet.
     */
    readonly exitCode: number | null;

    /**
     * The signal the child process was terminated with.
     *
     * Will be `null` if the child process was not terminated by a signal.
     */
    readonly signal: NodeJS.Signals | null;

    /**
     * A writable stream for the child process standard input.
     *
     * Will be `null` if the standard input is not piped from the parent process
     * in some manner.
     */
    readonly stdin: Writable | null;

    /**
     * A readable stream for the child process standard output.
     *
     * Will be `null` if the standard output is not piped to the parent process
     * in some manner.
     */
    readonly stdout: Readable | null;

    /**
     * A readable stream for the child process standard error.
     *
     * Will be `null` if the standard error is not piped to the parent process
     * in some manner.
     */
    readonly stderr: Readable | null;

    /**
     * Wait for the child process for finish.
     *
     * Note that this does not mean the child process finished successfully.
     * Check the exit code and signal.
     *
     * @returns A promise that resolves once the child process has finished or
     * rejects if an error occurs.
     */
    wait(): Promise<void>;

    /**
     * Wait for the child process for finish up to a maximum duration.
     *
     * Note that this does not mean the child process finished successfully.
     * Check the exit code and signal.
     *
     * @param timeout The maximum duration to wait, in milliseconds.
     *
     * @returns A promise that resolves once the child process has finished or
     * rejects if an error occurs or the timeout is reached.
     */
    waitFor(timeout: number): Promise<void>;
}

/**
 * The options for calling {@link spawn}.
 */
export interface SpawnOptions {
    /**
     * Whether to spawn the child process in a shell instance.
     *
     * @default false
     */
    shell?: boolean;

    /**
     * How to handle the standard inputs and outputs of the child process.
     *
     * Defaults to piping all three standard inputs/outputs to the parent
     * process.
     *
     * @default "pipe"
     */
    stdio?: child_process.StdioOptions;

    /**
     * Whether to hide any spawned command processor instance on Windows.
     *
     * Only relevant when {@link shell | `shell`} is `true`.
     *
     * @default false
     */
    windowsHide?: boolean;
}

/**
 * Spawn a child process.
 *
 * @param command The command to spawn.
 * @param argsOrOpts The arguments to pass to the command or the options to
 * spawn the command with.
 * @param opts The options to spawn the command with if arguments are provided.
 *
 * @returns A new object that can be used to work with the spawned child
 * process.
 *
 * @throws `Error`
 * Thrown if `argsOrOpts` is provided but `opts` is not.
 * @throws `Error`
 * Thrown if the command fails to spawn.
 */
export function spawn(
    command: string,
    argsOrOpts?: readonly string[] | Readonly<SpawnOptions>,
    opts?: Readonly<SpawnOptions>
): ChildProcess {
    const args: readonly string[] = Array.isArray(argsOrOpts) ? argsOrOpts : [];
    const spawnOpts: child_process.SpawnOptions =
        opts !== undefined ? opts
        : argsOrOpts === undefined || Array.isArray(argsOrOpts) ? {}
        : (argsOrOpts as Readonly<SpawnOptions>);
    const child_proc = child_process.spawn(command, args, spawnOpts);
    return {
        get command(): string {
            return command;
        },
        get arguments(): readonly string[] {
            return Array.isArray(argsOrOpts) ?
                    (argsOrOpts as readonly string[])
                :   args;
        },
        get isRunning(): boolean {
            return child_proc.exitCode === null;
        },
        get pid(): number | null {
            if (!this.isRunning) {
                return null;
            }
            return child_proc.pid ?? null;
        },
        get exitCode(): number | null {
            if (this.isRunning) {
                return null;
            }
            return child_proc.exitCode;
        },
        get signal(): NodeJS.Signals | null {
            if (this.isRunning) {
                return null;
            }
            return child_proc.signalCode;
        },
        get stdin(): Writable | null {
            return child_proc.stdin;
        },
        get stdout(): Readable | null {
            return child_proc.stdout;
        },
        get stderr(): Readable | null {
            return child_proc.stderr;
        },
        wait(): Promise<void> {
            return new Promise<void>((resolve, reject): void => {
                child_proc.addListener('error', (err): void => {
                    reject(err);
                });
                child_proc.addListener('exit', (): void => {
                    resolve();
                });
            });
        },
        waitFor(timeout: number): Promise<void> {
            return new Promise<void>((resolve, reject): void => {
                let exited = false;
                setTimeout((): void => {
                    child_proc.kill('SIGTERM');
                    //-- Wait half a second and then fallback to "SIGKILL" if the child process failed to exit
                    setTimeout((): void => {
                        if (child_proc.killed && !exited) {
                            child_proc.kill('SIGKILL');
                        }
                    }, 500);
                }, timeout);
                child_proc.addListener('error', (err): void => {
                    reject(err);
                });
                child_proc.addListener('exit', (): void => {
                    exited = true;
                    resolve();
                });
            });
        }
    };
}

/**
 * Run a command.
 *
 * @param command The command to run.
 * @param argsOrOpts The arguments to pass to the command or the options to
 * run the command with.
 * @param opts The options to run the command with if arguments are provided.
 *
 * @returns The output of the command.
 *
 * @throws `Error`
 * Thrown if `argsOrOpts` is provided but `opts` is not.
 * * @throws `Error`
 * Thrown if the command fails to spawn.
 * @throws `Error`
 * Thrown if the command fails to run.
 */
export async function run(
    command: string,
    argsOrOpts?: readonly string[] | Readonly<SpawnOptions>,
    opts?: Readonly<SpawnOptions>
): Promise<string> {
    const child_proc = spawn(command, argsOrOpts, {
        ...opts,
        stdio: ['ignore', 'pipe', 'ignore']
    });
    let stdoutBuffer = '';
    child_proc.stdout!.addListener('data', (chunk): void => {
        stdoutBuffer += Buffer.from(chunk).toString('utf-8');
    });
    await child_proc.wait();
    if (child_proc.exitCode !== 0) {
        throw new Error(
            `Command "${command}" failed to run (exited with code "${child_proc.exitCode}")!`
        );
    }
    if (child_proc.signal !== null) {
        throw new Error(
            `Command "${command}" failed to run (terminated with signal "${child_proc.signal}")!`
        );
    }
    return stdoutBuffer;
}
