import { ByteConstructorOptions, ByteConstructorParameters } from "../types/byte.type";
import * as utils from '../utils';


export class Byte {
  private parsed : number;
  constructor(private origin : ByteConstructorParameters , options? : ByteConstructorOptions){
    this.parsed = utils.parse(this.origin, options)[0];
  }

  /**
   * 16진수 문자열로 변환
   * @param includePrefix 전치사(0x)를 포함할지 여부입니다
   * @returns 전환된 16진수 문자열 배열입니다
   */
  public toHex(includePrefix?: boolean) {
   return `${includePrefix ? '0x' : ''}${this.parsed.toString(16).padStart(2, '0')}`
  }

  public toNum(){
    return this.parsed;
  }

  public toString(){
    return `${this.parsed}`;
  }
}