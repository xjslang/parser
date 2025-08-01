# @xjslang/parser

XJS language parser with modular subpath exports.

## Installation

```bash
npm install @xjslang/parser
```

## Usage

### Main Parser

```js
import { parse } from '@xjslang/parser'

const result = parse('your xjs code here')
```

### Defer Parser

```js
import { parseDefer } from '@xjslang/parser/defer'

const result = parseDefer('defer expression')
```

### Mut Parser

```js
import { parseMut } from '@xjslang/parser/mut'

const result = parseMut('mut expression')
```

## Development

### Build

```bash
npm run build
```

### Watch Mode

```bash
npm run dev
```

### Clean

```bash
npm run clean
```

## Structure

- `src/index.ts` - Main parser entry point
- `src/defer/` - Defer parsing functionality
- `src/mut/` - Mut parsing functionality
- `defer.ts` - Defer subpath entry
- `mut.ts` - Mut subpath entry

## License

MIT
