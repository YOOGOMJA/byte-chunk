import {
  ByteConstructorOptions,
  ByteConstructorParameters,
} from "../types/byte.type";
import * as utils from "../utils";
import { Buffer } from "buffer";
import { Byte } from "./byte.class";
import { Range } from "../types/unit.type";

export class ByteChunk {
  private parsed: Byte[] = [];

  private clear = () => {
    while (this.parsed.length > 1) {
      this.parsed.pop();
    }
  };

  private parse(
    args: ByteConstructorParameters | string[] | number[],
    options?: ByteConstructorOptions,
  ): Byte | Byte[] {
    if (args instanceof Array) {
      const results: Byte[] = [];

      args.forEach((_) => {
        const parsed = this.parse(_, options);
        if (parsed instanceof Array) {
          parsed.forEach((__) => results.push(__));
        } else {
          results.push(parsed);
        }
      });

      return results;
    } else {
      if (typeof args === "string") {
        const _parsed = utils.parse(args, options);
        return _parsed.map((_) => new Byte(_));
      } else {
        return new Byte(args);
      }
    }
  }

  constructor(
    private origin: ByteConstructorParameters | string[] | number[],
    options?: ByteConstructorOptions,
  ) {
    this.clear();
    const parsed = this.parse(this.origin, options);
    if (parsed instanceof Array) {
      this.parsed = parsed;
    } else {
      this.parsed.push(parsed);
    }
  }

  public get(): ByteChunk;
  public get(range: Range): ByteChunk;
  public get(position: number): Byte;
  public get(args?: Range | number): ByteChunk | Byte {
    if (args) {
      if (typeof args !== "number") {
        const { start, end } = args;
        return new ByteChunk(
          this.parsed.slice(start, end + 1).map((_) => _.toNum()),
        );
      } else {
        const found = this.parsed[args];
        if (found) {
          return found;
        } else {
          throw new Error("[ByteChunk] can not found at " + args);
        }
      }
    } else {
      return this.get({ start: 0, end: this.parsed.length });
    }
  }

  public toString(): string;
  public toString(
    options: { splited?: false; withHex?: boolean; withHexPrefix?: boolean },
  ): string;
  public toString(
    options: { splited: true; withHex?: boolean; withHexPrefix?: boolean },
  ): string[];
  public toString(
    options?: { splited?: boolean; withHex?: boolean; withHexPrefix?: boolean },
  ): string | string[] {
    if (options) {
      const { splited = false, withHex = false, withHexPrefix = false } =
        options;
      if (splited) {
        return this.parsed.map((byte) => {
          return withHex ? byte.toHex(withHexPrefix) : byte.toString();
        });
      } else {
        const _splited = this.toString({
          splited: true,
          withHex,
          withHexPrefix,
        });
        return _splited.join("");
      }
    } else {
      return this.toString({
        splited: false,
        withHex: false,
        withHexPrefix: false,
      });
    }
  }

  public toArray(): Byte[];
  public toArray(config?: { asNumber?: false }): Byte[];
  public toArray(config?: { asNumber?: false; range: Range }): Byte[];
  public toArray(
    config?: { asString?: true; withHex?: boolean; withHexPrefix?: boolean },
  ): string[];
  public toArray(
    config?: {
      asString?: true;
      withHex?: boolean;
      withHexPrefix?: boolean;
      range: Range;
    },
  ): string[];
  public toArray(config?: { asNumber: true }): number[];
  public toArray(config?: { asNumber: true; range: Range }): number[];
  public toArray(
    config?: {
      asString?: boolean;
      withHex?: boolean;
      withHexPrefix?: boolean;
      asNumber?: boolean;
      range?: Range;
    },
  ): Byte[] | number[] | string[] {
    if (config) {
      const {
        asString = false,
        withHex = false,
        withHexPrefix = false,
        asNumber = false,
        range = { start: 0, end: this.parsed.length },
      } = config;
      const chunk = this.get(range);

      if (asNumber) {
        return chunk.parsed.map((byte) => byte.toNum());
      } else if (asString) {
        return chunk.parsed.map((byte) =>
          withHex ? byte.toHex(withHexPrefix) : byte.toString()
        );
      } else {
        return chunk.parsed;
      }
    } else {
      return this.toArray({
        asNumber: false,
        range: { start: 0, end: this.parsed.length },
      });
    }
  }

  public toBuffer() {
    return Buffer.from(this.toUInt8Array());
  }

  public toUInt8Array() {
    return new Uint8Array(this.toArray({ asNumber: true }));
  }

  public concat(
    target: number[] | string[] | Byte[],
    options?: ByteConstructorOptions,
  ): ByteChunk;
  public concat(
    target: string | number | Byte,
    options?: ByteConstructorOptions,
  ): ByteChunk;
  public concat(target: ByteChunk): ByteChunk;
  public concat(
    args: number | string | Byte | string[] | number[] | Byte[] | ByteChunk,
    options?: ByteConstructorOptions,
  ): ByteChunk {
    if (args instanceof ByteChunk) {
      this.concat(args.toArray(), options);
      return this;
    } else if (args instanceof Array) {
      args.forEach((item) => this.concat(item, options));

      return this;
    } else {
      if (args instanceof Byte) {
        this.parsed.push(args);
      } else {
        this.parsed.push(
          new Byte(args, options),
        );
      }

      return this;
    }
  }

  public static from(bytes: Byte[]) {
    return new ByteChunk(bytes.map((byte) => byte.toNum()));
  }

  public static concat(...args: ByteChunk[]) {
    const results: Byte[] = [];
    args.forEach((chunk) => {
      results.push(...chunk.toArray());
    });

    return ByteChunk.from(results);
  }
}
