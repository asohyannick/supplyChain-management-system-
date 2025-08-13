declare module 'jimp' {
    export interface Jimp {
        grayscale(): this;
        resize(width: number, height: number): this;
        clone(): this;
        crop(x: number, y: number, width: number, height: number): this;
        getBase64(mime: string, callback: (err: Error | null, res: string) => void): void;
    }

    export function read(buffer: Buffer | string): Promise<Jimp>;
    export const MIME_PNG: string;
}