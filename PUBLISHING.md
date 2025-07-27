# Publishing Guide

## Preparation

1. Make sure you are logged in to npm with the `xjslang` organization:

   ```bash
   npm whoami
   npm login
   ```

2. Verify that you have access to the organization:
   ```bash
   npm org ls xjslang
   ```

## Build and Publish

1. Build the project:

   ```bash
   npm run build
   ```

2. Check that the package is ready:

   ```bash
   npm pack --dry-run
   ```

3. Publish the package:
   ```bash
   npm publish --access public
   ```

## Post-Publish Verification

Once published, users can install and use the package:

```bash
npm install @xjslang/parser
```

And use the imports:

```js
import { parse } from '@xjslang/parser'
import { parseDefer } from '@xjslang/parser/defer'
import { parseMut } from '@xjslang/parser/mut'
```

## Package Structure

- `@xjslang/parser` - Exports all functions (parse, parseDefer, parseMut)
- `@xjslang/parser/defer` - Only exports functions related to defer
- `@xjslang/parser/mut` - Only exports functions related to mut

