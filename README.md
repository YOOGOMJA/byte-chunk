# bite-chunk

A tool for treat byte with string, number or array

## Usage

### Byte

```typescript

import { Byte } from '@yoogomja/byte-chunk';

const fromPlainText = new Byte('1');
const fromHexText = new Byte('1d' , { includeHexdecimal : true });
const fromNumber = new Byte(123);

```
