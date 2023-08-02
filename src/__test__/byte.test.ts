import { ByteChunk } from "../classes/chunk.class";

describe('Byte  > 초기화 및 기본 함수', () => {
  it('constructor > 문자열', () => {
    const targets = 'hello';
    const expectingToEquals = [104, 101, 108, 108, 111];
    const chunk = new ByteChunk(targets);
    
    expect(chunk.toArray({ asNumber : true })).toStrictEqual(expectingToEquals);
  });

  it('constructor > 16진수 문자열', () => {
    const targets = 'a1b2c3d4';
    const expectingToEquals = [0xa1, 0xb2, 0xc3, 0xd4];
    const chunk = new ByteChunk(targets, { includeHexdecimal : true });

    expect(chunk.toArray({asNumber : true})).toStrictEqual(expectingToEquals);
  });

  it('constructor > 잘못된 형태의 16진수 문자열', () => expect(()=>{
    const targets = 'a1b2c3d45';
    new ByteChunk(targets, { includeHexdecimal : true });
  }).toThrowError(new Error('[parse] unvalid hex string')));

  it('문자 배열', () => {
    const targets = ['h', 'e', 'l', 'l', 'o'];
    const expectingToEquals = [104, 101, 108, 108, 111];
    
    const chunk = new ByteChunk(targets);
    
    expect(chunk.toArray({ asNumber : true })).toStrictEqual(expectingToEquals);
  });

  it('16진수 문자 배열 ', () => {
    const targets = ['a1', 'b2', 'c3', 'd4'];
    const expectingToEquals = [0xa1, 0xb2, 0xc3, 0xd4];

    const chunk = new ByteChunk(targets , {includeHexdecimal : true});
    
    expect(chunk.toArray({ asNumber : true })).toStrictEqual(expectingToEquals);
  });

  it('숫자를 초기화', () => {
    const targets = 1;
    const expectingToEquals = [1];

    const chunk = new ByteChunk(targets);
    
    expect(chunk.toArray({ asNumber : true })).toStrictEqual(expectingToEquals);
  });

  it('숫자 배열을 초기화', () => {
    const targets = [1, 2, 3];
    const expectingToEquals = [1, 2, 3];
    const chunk = new ByteChunk(targets);
    
    expect(chunk.toArray({ asNumber : true })).toStrictEqual(expectingToEquals);
  });

  it('.get > range 추가', () => {
    const targets = [1, 2, 3, 4];
    const expectingToEquals = [2, 3];

    const chunk = new ByteChunk(targets);
    
    expect(chunk.get({start : 1, end : 2}).toArray({asNumber : true})).toStrictEqual(expectingToEquals);
  });
});

describe('변환 함수 확인', () => {
  it('chunk > toHex]접두사(0x) 미포함', () => {
    const targets = [0xa1, 0xb2, 0xc3, 0xd4];
    const expectingToEquals = ['a1', 'b2', 'c3', 'd4'];

    const byte = new ByteChunk(targets);

    expect(byte.toArray({ asString : true, withHex : true })).toStrictEqual(expectingToEquals);
  });

  it('chunk > toHex > 접두사(0x) 포함', () => {
    const targets = [0xa1, 0xb2, 0xc3, 0xd4];
    const expectingToEquals = ['0xa1', '0xb2', '0xc3', '0xd4'];

    const byte = new ByteChunk(targets);

    expect(byte.toArray({ asString : true, withHex : true , withHexPrefix : true})).toStrictEqual(expectingToEquals);
  });

  it('chunk > toUInt8Array > UInt8Array 타입 생성 및 값 체크', () => {
    const targets = '012345';
    const expectingToEquals = new Uint8Array([48, 49, 50, 51, 52, 53]);
    const byte = new ByteChunk(targets);

    const converted = byte.toUInt8Array();

    expect(converted).toBeInstanceOf(Uint8Array);
    expect(converted).toStrictEqual(expectingToEquals);
  });

  it('chunk > toBuffer > Buffer 타입 생성 및 값 체크', () => {
    const targets = '012345';
    const expectingToEquals = Buffer.from([48, 49, 50, 51, 52, 53]);
    const byte = new ByteChunk(targets);

    const converted = byte.toBuffer();

    expect(converted).toBeInstanceOf(Uint8Array);
    expect(converted).toStrictEqual(expectingToEquals);
  });
});

describe('기능 함수', () => {
  it(`chunk > concat > 일반 합치기`, () => {
    const targets = '012345';
    const expectingToEquals = [48, 49, 50, 51, 52, 53, 54, 55];

    const chunk = new ByteChunk(targets);

    chunk.concat(['6', '7']);

    expect(chunk.toArray({asNumber : true})).toStrictEqual(expectingToEquals);
  });

  it(`chunk > concat > Byte 타입 합치기`, () => {
    const targets = '012345';
    const expectingToEquals = [48, 49, 50, 51, 52, 53, 54, 55];

    const chunk = new ByteChunk(targets);

    chunk.concat(new ByteChunk(['6', '7']));

    expect(chunk.toArray({asNumber : true})).toStrictEqual(expectingToEquals);
  });
});
