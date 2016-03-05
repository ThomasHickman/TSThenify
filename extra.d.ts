`declare module "mz/readline" {
    import * as events from "events";
    import * as stream from "stream";

    export interface Key {
        sequence?: string;
        name?: string;
        ctrl?: boolean;
        meta?: boolean;
        shift?: boolean;
    }

    export interface ReadLine extends events.EventEmitter {
        setPrompt(prompt: string): void;
        prompt(preserveCursor?: boolean): void;
        question(query: string): Promise<string>;
        pause(): ReadLine;
        resume(): ReadLine;
        close(): void;
        write(data: string|Buffer, key?: Key): void;
    }

    export interface Completer {
        (line: string): Promise<CompleterResult>;
    }

    export interface CompleterResult {
        completions: string[];
        line: string;
    }

    export interface ReadLineOptions {
        input: NodeJS.ReadableStream;
        output?: NodeJS.WritableStream;
        completer?: Completer;
        terminal?: boolean;
        historySize?: number;
    }

    export function createInterface(input: NodeJS.ReadableStream, output?: NodeJS.WritableStream, completer?: Completer, terminal?: boolean): ReadLine;
    export function createInterface(options: ReadLineOptions): ReadLine;

    export function cursorTo(stream: NodeJS.WritableStream, x: number, y: number): void;
    export function moveCursor(stream: NodeJS.WritableStream, dx: number|string, dy: number|string): void;
    export function clearLine(stream: NodeJS.WritableStream, dir: number): void;
    export function clearScreenDown(stream: NodeJS.WritableStream): void;
}


declare module "mz"{
    export import child_process = require("mz/child_process");
    export import crypto = require("mz/child_process")
    export import dns = require("mz/dns")
    export import fs = require("mz/fs")
    export import readline = require("mz/readline")
    export import zlib = require("mz/zlib")
}
