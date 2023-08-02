import {
  ByteConstructorOptions,
  ByteConstructorParameters,
} from "../types/byte.type";
import { splitHex } from "./split-hex.util";

export const parse = (
  params: ByteConstructorParameters,
  options?: ByteConstructorOptions,
): number[] => {
  if (typeof params === "string") {
    if (options?.includeHexdecimal) {
      const splited = splitHex(params);

      if (!splited || splited.length === 0) {
        throw new Error(`[parse] unhandled type`);
      }
      else if(splited.join('') !== params){
        throw new Error(`[parse] unvalid hex string`);
      }

      return splited.map((_)=>Number(`0x${_.padStart(2, "0")}`));
    } else {
      return params.split('').map((_)=>_.charCodeAt(0));
    }
  } else if (typeof params === "number") {
    return [params];
  } else {
    throw new Error(
      `[parse] Not Supported Types : [${params} : ${typeof params}]`,
    );
  }
};
