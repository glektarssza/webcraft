/**
 * A simple utility for locating programs on the system path.
 *
 * @module
 */

//-- NodeJS
import fs from 'node:fs';
import path from 'node:path';

/**
 * A list of valid extensions for the current platform.
 */
const VALID_EXTENSIONS: string[] = [];

switch (process.platform) {
    case 'win32':
        VALID_EXTENSIONS.push('.cmd', '.bat', '.exe');
        break;
    case 'darwin':
    case 'linux':
        VALID_EXTENSIONS.push('.sh');
        break;
}

/**
 * Find a given program on the system path.
 *
 * @param program - The program to locate.
 * @param all - Whether to locate all instances of the program or just the
 * first.
 *
 * @returns A promise that resolves to the located program(s) or `null` if no
 * instance(s) could be located.
 */
export async function which(
    program: string,
    all: false
): Promise<string | null>;

/**
 * Find a given program on the system path.
 *
 * @param program - The program to locate.
 * @param all - Whether to locate all instances of the program or just the
 * first.
 *
 * @returns A promise that resolves to the located program(s) or `null` if no
 * instance(s) could be located.
 */
export async function which(
    program: string,
    all: true
): Promise<string[] | null>;

/**
 * Find a given program on the system path.
 *
 * @param program - The program to locate.
 * @param all - Whether to locate all instances of the program or just the
 * first.
 *
 * @returns A promise that resolves to the located program(s) or `null` if no
 * instance(s) could be located.
 */
export async function which(
    program: string,
    all?: boolean
): Promise<string[] | null>;

/**
 * Find a given program on the system path.
 *
 * @param program - The program to locate.
 * @param all - Whether to locate all instances of the program or just the
 * first.
 *
 * @returns A promise that resolves to the located program(s) or `null` if no
 * instance(s) could be located.
 */
export async function which(
    program: string,
    all: boolean = false
): Promise<string | string[] | null> {
    return new Promise<string | string[] | null>((resolve, reject) => {
        try {
            resolve(whichSync(program, all));
        } catch (ex) {
            if (ex instanceof Error) {
                reject(ex);
                return;
            }
            reject(
                new Error('Unknown error', {
                    cause: ex
                })
            );
        }
    });
}

/**
 * Find a given program on the system path.
 *
 * @param program - The program to locate.
 * @param all - Whether to locate all instances of the program or just the
 * first.
 *
 * @returns A promise that resolves to the located program(s) or `null` if no
 * instance(s) could be located.
 */
export function whichSync(program: string, all: true): string[] | null;

/**
 * Find a given program on the system path.
 *
 * @param program - The program to locate.
 * @param all - Whether to locate all instances of the program or just the
 * first.
 *
 * @returns A promise that resolves to the located program(s) or `null` if no
 * instance(s) could be located.
 */
export function whichSync(program: string, all: false): string | null;

/**
 * Find a given program on the system path.
 *
 * @param program - The program to locate.
 * @param all - Whether to locate all instances of the program or just the
 * first.
 *
 * @returns A promise that resolves to the located program(s) or `null` if no
 * instance(s) could be located.
 */
export function whichSync(program: string, all?: boolean): string | null;

/**
 * Find a given program on the system path.
 *
 * @param program - The program to locate.
 * @param all - Whether to locate all instances of the program or just the
 * first.
 *
 * @returns A promise that resolves to the located program(s) or `null` if no
 * instance(s) could be located.
 */
export function whichSync(
    program: string,
    all: boolean = false
): string | string[] | null {
    const searchPatterns = (
        VALID_EXTENSIONS.some((ext) => program.endsWith(ext)) ?
            [program]
        :   VALID_EXTENSIONS.map((ext) => `${program}${ext}`)).map((item) =>
        item.toLowerCase()
    );
    const sysPathItems = (process.env['PATH'] ?? '').split(path.delimiter);
    if (sysPathItems.length <= 0) {
        return null;
    }
    const searchPaths = sysPathItems
        .filter((item) => fs.existsSync(item))
        .filter((item) => fs.statSync(item).isDirectory());
    const filesInSearchPaths = searchPaths.flatMap((dir) =>
        fs.readdirSync(dir).flatMap((item) => path.join(dir, item))
    );
    const matchingFiles = filesInSearchPaths.filter((file) =>
        searchPatterns.some((item) => file.includes(item))
    );
    return (
        matchingFiles.length <= 0 ? null
        : all ? matchingFiles
        : (matchingFiles[0] ?? null)
    );
}

export default which;
