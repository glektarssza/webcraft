/**
 * Get the ANSI control sequence to reset the graphics.
 *
 * @returns The ANSI control sequence to reset the graphics.
 */
export function sgrReset(): string {
    return '\x1b[0m';
}

/**
 * Get the ANSI control sequence to set the graphics to bold.
 *
 * @returns The ANSI control sequence to set the graphics to bold.
 */
export function sgrBold(): string {
    return '\x1b[1m';
}

/**
 * Get the ANSI control sequence to set the graphics to faint.
 *
 * @returns The ANSI control sequence to set the graphics to faint.
 */
export function sgrFaint(): string {
    return '\x1b[2m';
}

/**
 * Get the ANSI control sequence to set the graphics to not bold.
 *
 * @returns The ANSI control sequence to set the graphics to not bold.
 */
export function sgrNotBold(): string {
    return '\x1b[22m';
}

/**
 * Get the ANSI control sequence to set the graphics to not faint.
 *
 * @returns The ANSI control sequence to set the graphics to not faint.
 */
export function sgrNotFaint(): string {
    return sgrNotBold();
}

/**
 * Get the ANSI control sequence to set the graphics to italic.
 *
 * @returns The ANSI control sequence to set the graphics to italic.
 */
export function sgrItalic(): string {
    return '\x1b[3m';
}

/**
 * Get the ANSI control sequence to set the graphics to not italic.
 *
 * @returns The ANSI control sequence to set the graphics to not italic.
 */
export function sgrNotItalic(): string {
    return '\x1b[23m';
}

/**
 * Get the ANSI control sequence to set the graphics to underlined.
 *
 * @returns The ANSI control sequence to set the graphics to underlined.
 */
export function sgrUnderlined(): string {
    return '\x1b[4m';
}

/**
 * Get the ANSI control sequence to set the graphics to double underlined.
 *
 * @returns The ANSI control sequence to set the graphics to double underlined.
 */
export function sgrDoubleUnderlined(): string {
    return '\x1b[21m';
}

/**
 * Get the ANSI control sequence to set the graphics to not underlined.
 *
 * @returns The ANSI control sequence to set the graphics to not underlined.
 */
export function sgrNotUnderlined(): string {
    return '\x1b[24m';
}

/**
 * Get the ANSI control sequence to set the graphics to not double underlined.
 *
 * @returns The ANSI control sequence to set the graphics to not double
 * underlined.
 */
export function sgrNotDoubleUnderlined(): string {
    return sgrNotUnderlined();
}

/**
 * Get the ANSI control sequence to set the graphics to slow blink.
 *
 * @returns The ANSI control sequence to set the graphics to slow blink.
 */
export function sgrSlowBlink(): string {
    return '\x1b[5m';
}

/**
 * Get the ANSI control sequence to set the graphics to rapid blink.
 *
 * @returns The ANSI control sequence to set the graphics to rapid blink.
 */
export function sgrRapidBlink(): string {
    return '\x1b[6m';
}

/**
 * Get the ANSI control sequence to set the graphics to not blink.
 *
 * @returns The ANSI control sequence to set the graphics to not blink.
 */
export function sgrNotBlink(): string {
    return '\x1b[25m';
}

/**
 * Get the ANSI control sequence to set the graphics to not slow blink.
 *
 * @returns The ANSI control sequence to set the graphics to not slow blink.
 */
export function sgrNotSlowBlink(): string {
    return sgrNotBlink();
}

/**
 * Get the ANSI control sequence to set the graphics to not rapid blink.
 *
 * @returns The ANSI control sequence to set the graphics to not rapid blink.
 */
export function sgrNotRapidBlink(): string {
    return sgrNotBlink();
}

/**
 * Get the ANSI control sequence to set the graphics to inverted.
 *
 * @returns The ANSI control sequence to set the graphics to inverted.
 */
export function sgrInverted(): string {
    return '\x1b[7m';
}

/**
 * Get the ANSI control sequence to set the graphics to not inverted.
 *
 * @returns The ANSI control sequence to set the graphics to not inverted.
 */
export function sgrNotInverted(): string {
    return '\x1b[27m';
}

/**
 * Get the ANSI control sequence to set the graphics to concealed.
 *
 * @returns The ANSI control sequence to set the graphics to concealed.
 */
export function sgrConcealed(): string {
    return '\x1b[8m';
}

/**
 * Get the ANSI control sequence to set the graphics to not concealed.
 *
 * @returns The ANSI control sequence to set the graphics to not concealed.
 */
export function sgrNotConcealed(): string {
    return '\x1b[28m';
}

/**
 * Get the ANSI control sequence to set the graphics to crossed out.
 *
 * @returns The ANSI control sequence to set the graphics to crossed out.
 */
export function sgrCrossedOut(): string {
    return '\x1b[9m';
}

/**
 * Get the ANSI control sequence to set the graphics to not crossed out.
 *
 * @returns The ANSI control sequence to set the graphics to not crossed out.
 */
export function sgrNotCrossedOut(): string {
    return '\x1b[29m';
}

/**
 * Get the ANSI control sequence to set the graphics to the given font index.
 *
 * @param i The font index to activate.
 *
 * @returns The ANSI control sequence to set the graphics to the given font
 * index.
 *
 * @throws `Error`
 * Thrown if the font index is not valid.
 */
export function sgrFont(i: number): string {
    if (i < 0 || i > 9) {
        throw new Error(`Invalid font index "${i}"`);
    }
    return `\x1b[1${i}m`;
}

/**
 * Get the ANSI control sequence to set the graphics to the primary font.
 *
 * @returns The ANSI control sequence to set the graphics to the primary font.
 */
export function sgrPrimaryFont(): string {
    return sgrFont(0);
}

/**
 * Get the ANSI control sequence to set the graphics foreground to a 4-bit
 * color.
 *
 * @param i The index of the color to get.
 * @param bright Whether to get the bright variant of the color.
 *
 * @returns The ANSI control sequence to set the graphics foreground to a 4-bit
 * color.
 *
 * @throws `Error`
 * Thrown if the index is out of range.
 */
export function sgrFg4Bit(i: number, bright: boolean = false): string {
    if (i < 0 || i > 7) {
        throw new Error(`4-bit color index "${i}" is out of range`);
    }
    return `\x1b[${bright ? '3' : '9'}${i}m`;
}

/**
 * Get the ANSI control sequence to set the graphics background to a 4-bit
 * color.
 *
 * @param i The index of the color to get.
 * @param bright Whether to get the bright variant of the color.
 *
 * @returns The ANSI control sequence to set the graphics background to a 4-bit
 * color.
 *
 * @throws `Error`
 * Thrown if the index is out of range.
 */
export function sgrBg4Bit(i: number, bright: boolean = false): string {
    if (i < 0 || i > 7) {
        throw new Error(`4-bit color index "${i}" is out of range`);
    }
    return `\x1b[${bright ? '4' : '10'}${i}m`;
}

/**
 * Get the ANSI control sequence to set the graphics foreground to the bright
 * variant of a 4-bit color.
 *
 * @param i The index of the color to get.
 *
 * @returns The ANSI control sequence to set the graphics foreground to the
 * bright variant of a 4-bit color.
 *
 * @throws `Error`
 * Thrown if the index is out of range.
 */
export function sgrFg4BitBright(i: number): string {
    return sgrFg4Bit(i, true);
}

/**
 * Get the ANSI control sequence to set the graphics background to the bright
 * variant of a 4-bit color.
 *
 * @param i The index of the color to get.
 * @param bright Whether to get the bright variant of the color.
 *
 * @returns The ANSI control sequence to set the graphics background to the
 * bright variant of a 4-bit color.
 *
 * @throws `Error`
 * Thrown if the index is out of range.
 */
export function sgrBg4BitBright(i: number): string {
    return sgrBg4Bit(i, true);
}

/**
 * Get the ANSI control sequence to set the graphics foreground to the color
 * black.
 *
 * @returns The ANSI control sequence to set the graphics foreground to the
 * color black.
 */
export function sgrFgBlack(): string {
    return sgrFg4Bit(0);
}

/**
 * Get the ANSI control sequence to set the graphics background to the color
 * black.
 *
 * @returns The ANSI control sequence to set the graphics background to the
 * color black.
 */
export function sgrBgBlack(): string {
    return sgrBg4Bit(0);
}

/**
 * Get the ANSI control sequence to set the graphics foreground to the color
 * red.
 *
 * @returns The ANSI control sequence to set the graphics foreground to the
 * color red.
 */
export function sgrFgRed(): string {
    return sgrFg4Bit(1);
}

/**
 * Get the ANSI control sequence to set the graphics background to the color
 * red.
 *
 * @returns The ANSI control sequence to set the graphics background to the
 * color red.
 */
export function sgrBgRed(): string {
    return sgrBg4Bit(1);
}

/**
 * Get the ANSI control sequence to set the graphics foreground to the color
 * green.
 *
 * @returns The ANSI control sequence to set the graphics foreground to the
 * color green.
 */
export function sgrFgGreen(): string {
    return sgrFg4Bit(2);
}

/**
 * Get the ANSI control sequence to set the graphics background to the color
 * green.
 *
 * @returns The ANSI control sequence to set the graphics background to the
 * color green.
 */
export function sgrBgGreen(): string {
    return sgrBg4Bit(2);
}

/**
 * Get the ANSI control sequence to set the graphics foreground to the color
 * yellow.
 *
 * @returns The ANSI control sequence to set the graphics foreground to the
 * color yellow.
 */
export function sgrFgYellow(): string {
    return sgrFg4Bit(3);
}

/**
 * Get the ANSI control sequence to set the graphics background to the color
 * yellow.
 *
 * @returns The ANSI control sequence to set the graphics background to the
 * color yellow.
 */
export function sgrBgYellow(): string {
    return sgrBg4Bit(3);
}

/**
 * Get the ANSI control sequence to set the graphics foreground to the color
 * blue.
 *
 * @returns The ANSI control sequence to set the graphics foreground to the
 * color blue.
 */
export function sgrFgBlue(): string {
    return sgrFg4Bit(4);
}

/**
 * Get the ANSI control sequence to set the graphics background to the color
 * blue.
 *
 * @returns The ANSI control sequence to set the graphics background to the
 * color blue.
 */
export function sgrBgBlue(): string {
    return sgrBg4Bit(4);
}

/**
 * Get the ANSI control sequence to set the graphics foreground to the color
 * magenta.
 *
 * @returns The ANSI control sequence to set the graphics foreground to the
 * color magenta.
 */
export function sgrFgMagenta(): string {
    return sgrFg4Bit(5);
}

/**
 * Get the ANSI control sequence to set the graphics background to the color
 * magenta.
 *
 * @returns The ANSI control sequence to set the graphics background to the
 * color magenta.
 */
export function sgrBgMagenta(): string {
    return sgrBg4Bit(5);
}

/**
 * Get the ANSI control sequence to set the graphics foreground to the color
 * cyan.
 *
 * @returns The ANSI control sequence to set the graphics foreground to the
 * color cyan.
 */
export function sgrFgCyan(): string {
    return sgrFg4Bit(6);
}

/**
 * Get the ANSI control sequence to set the graphics background to the color
 * cyan.
 *
 * @returns The ANSI control sequence to set the graphics background to the
 * color cyan.
 */
export function sgrBgCyan(): string {
    return sgrBg4Bit(6);
}

/**
 * Get the ANSI control sequence to set the graphics foreground to the color
 * white.
 *
 * @returns The ANSI control sequence to set the graphics foreground to the
 * color white.
 */
export function sgrFgWhite(): string {
    return sgrFg4Bit(7);
}

/**
 * Get the ANSI control sequence to set the graphics background to the color
 * white.
 *
 * @returns The ANSI control sequence to set the graphics background to the
 * color white.
 */
export function sgrBgWhite(): string {
    return sgrBg4Bit(7);
}

/**
 * Get the ANSI control sequence to set the graphics foreground to the color
 * bright black.
 *
 * @returns The ANSI control sequence to set the graphics foreground to the
 * color bright black.
 */
export function sgrFgBrightBlack(): string {
    return sgrFg4BitBright(0);
}

/**
 * Get the ANSI control sequence to set the graphics background to the color
 * bright black.
 *
 * @returns The ANSI control sequence to set the graphics background to the
 * color bright black.
 */
export function sgrBgBrightBlack(): string {
    return sgrBg4BitBright(0);
}

/**
 * Get the ANSI control sequence to set the graphics foreground to the color
 * gray.
 *
 * @returns The ANSI control sequence to set the graphics foreground to the
 * color gray.
 */
export function sgrFgGray(): string {
    return sgrFgBrightBlack();
}

/**
 * Get the ANSI control sequence to set the graphics background to the color
 * gray.
 *
 * @returns The ANSI control sequence to set the graphics background to the
 * color gray.
 */
export function sgrBgGray(): string {
    return sgrBgBrightBlack();
}

/**
 * Get the ANSI control sequence to set the graphics foreground to the color
 * grey.
 *
 * @returns The ANSI control sequence to set the graphics foreground to the
 * color grey.
 */
export function sgrFgGrey(): string {
    return sgrFgBrightBlack();
}

/**
 * Get the ANSI control sequence to set the graphics background to the color
 * grey.
 *
 * @returns The ANSI control sequence to set the graphics background to the
 * color grey.
 */
export function sgrBgGrey(): string {
    return sgrBgBrightBlack();
}

/**
 * Get the ANSI control sequence to set the graphics foreground to the color
 * bright red.
 *
 * @returns The ANSI control sequence to set the graphics foreground to the
 * color bright red.
 */
export function sgrFgBrightRed(): string {
    return sgrFg4BitBright(1);
}

/**
 * Get the ANSI control sequence to set the graphics background to the color
 * bright red.
 *
 * @returns The ANSI control sequence to set the graphics background to the
 * color bright red.
 */
export function sgrBgBrightRed(): string {
    return sgrBg4BitBright(1);
}

/**
 * Get the ANSI control sequence to set the graphics foreground to the color
 * bright green.
 *
 * @returns The ANSI control sequence to set the graphics foreground to the
 * color bright green.
 */
export function sgrFgBrightGreen(): string {
    return sgrFg4BitBright(2);
}

/**
 * Get the ANSI control sequence to set the graphics background to the color
 * bright green.
 *
 * @returns The ANSI control sequence to set the graphics background to the
 * color bright green.
 */
export function sgrBgBrightGreen(): string {
    return sgrBg4BitBright(2);
}

/**
 * Get the ANSI control sequence to set the graphics foreground to the color
 * bright yellow.
 *
 * @returns The ANSI control sequence to set the graphics foreground to the
 * color bright yellow.
 */
export function sgrFgBrightYellow(): string {
    return sgrFg4BitBright(3);
}

/**
 * Get the ANSI control sequence to set the graphics background to the color
 * bright yellow.
 *
 * @returns The ANSI control sequence to set the graphics background to the
 * color bright yellow.
 */
export function sgrBgBrightYellow(): string {
    return sgrBg4BitBright(3);
}

/**
 * Get the ANSI control sequence to set the graphics foreground to the color
 * bright blue.
 *
 * @returns The ANSI control sequence to set the graphics foreground to the
 * color bright blue.
 */
export function sgrFgBrightBlue(): string {
    return sgrFg4BitBright(4);
}

/**
 * Get the ANSI control sequence to set the graphics background to the color
 * bright blue.
 *
 * @returns The ANSI control sequence to set the graphics background to the
 * color bright blue.
 */
export function sgrBgBrightBlue(): string {
    return sgrBg4BitBright(4);
}

/**
 * Get the ANSI control sequence to set the graphics foreground to the color
 * bright magenta.
 *
 * @returns The ANSI control sequence to set the graphics foreground to the
 * color bright magenta.
 */
export function sgrFgBrightMagenta(): string {
    return sgrFg4BitBright(5);
}

/**
 * Get the ANSI control sequence to set the graphics background to the color
 * bright magenta.
 *
 * @returns The ANSI control sequence to set the graphics background to the
 * color bright magenta.
 */
export function sgrBgBrightMagenta(): string {
    return sgrBg4BitBright(5);
}

/**
 * Get the ANSI control sequence to set the graphics foreground to the color
 * bright cyan.
 *
 * @returns The ANSI control sequence to set the graphics foreground to the
 * color bright cyan.
 */
export function sgrFgBrightCyan(): string {
    return sgrFg4BitBright(6);
}

/**
 * Get the ANSI control sequence to set the graphics background to the color
 * bright cyan.
 *
 * @returns The ANSI control sequence to set the graphics background to the
 * color bright cyan.
 */
export function sgrBgBrightCyan(): string {
    return sgrBg4BitBright(6);
}

/**
 * Get the ANSI control sequence to set the graphics foreground to the color
 * bright white.
 *
 * @returns The ANSI control sequence to set the graphics foreground to the
 * color bright white.
 */
export function sgrFgBrightWhite(): string {
    return sgrFg4BitBright(7);
}

/**
 * Get the ANSI control sequence to set the graphics background to the color
 * bright white.
 *
 * @returns The ANSI control sequence to set the graphics background to the
 * color bright white.
 */
export function sgrBgBrightWhite(): string {
    return sgrBg4BitBright(7);
}

/**
 * Get the ANSI control sequence to set the graphics foreground to an 8-bit
 * color.
 *
 * @param i The index of the color to get.
 *
 * @returns The ANSI control sequence to set the graphics foreground to an 8-bit
 * color.
 *
 * @throws `Error`
 * Thrown if the index is out of range.
 */
export function sgrFg8Bit(i: number): string {
    if (i < 0 || i > 255) {
        throw new Error(`8-bit color index "${i}" is out of range`);
    }
    return `\x1b[38;5;${i}m`;
}

/**
 * Get the ANSI control sequence to set the graphics foreground to an 8-bit
 * color.
 *
 * @param i The index of the color to get.
 *
 * @returns The ANSI control sequence to set the graphics foreground to an 8-bit
 * color.
 *
 * @throws `Error`
 * Thrown if the index is out of range.
 */
export function sgrBg8Bit(i: number): string {
    if (i < 0 || i > 255) {
        throw new Error(`8-bit color index "${i}" is out of range`);
    }
    return `\x1b[48;5;${i}m`;
}

/**
 * Get the ANSI control sequence to set the graphics foreground to a 24-bit
 * color.
 *
 * @param r The red component of the color to get.
 * @param g The green component of the color to get.
 * @param b The blue component of the color to get.
 *
 * @returns The ANSI control sequence to set the graphics foreground to a 24-bit
 * color.
 *
 * @throws `Error`
 * Thrown if the red component is out of range.
 * @throws `Error`
 * Thrown if the green component is out of range.
 * @throws `Error`
 * Thrown if the blue component is out of range.
 */
export function sgrFg24Bit(r: number, g: number, b: number): string {
    if (r < 0 || r > 255) {
        throw new Error(`24-bit color red component "${r}" is out of range`);
    }
    if (g < 0 || g > 255) {
        throw new Error(`24-bit color green component "${g}" is out of range`);
    }
    if (b < 0 || b > 255) {
        throw new Error(`24-bit color blue component "${b}" is out of range`);
    }
    return `\x1b[38;2;${r};${g};${b}m`;
}

/**
 * Get the ANSI control sequence to set the graphics foreground to a 24-bit
 * color.
 *
 * @param r The red component of the color to get.
 * @param g The green component of the color to get.
 * @param b The blue component of the color to get.
 *
 * @returns The ANSI control sequence to set the graphics foreground to a 24-bit
 * color.
 *
 * @throws `Error`
 * Thrown if the red component is out of range.
 * @throws `Error`
 * Thrown if the green component is out of range.
 * @throws `Error`
 * Thrown if the blue component is out of range.
 */
export function sgrBg24Bit(r: number, g: number, b: number): string {
    if (r < 0 || r > 255) {
        throw new Error(`24-bit color red component "${r}" is out of range`);
    }
    if (g < 0 || g > 255) {
        throw new Error(`24-bit color green component "${g}" is out of range`);
    }
    if (b < 0 || b > 255) {
        throw new Error(`24-bit color blue component "${b}" is out of range`);
    }
    return `\x1b[48;2;${r};${g};${b}m`;
}
